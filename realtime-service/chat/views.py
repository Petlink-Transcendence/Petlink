from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from django.db.models import Q
from django.conf import settings
import os
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Message

def get_user_id(request):
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    try:
        token = AccessToken(auth.split(' ')[1])
        return token['user_id']
    except (InvalidToken, TokenError):
        return None

@api_view(['GET'])
def message_history(request, user_id):
    logged_in_user = get_user_id(request)

    if not logged_in_user:
        return Response(
            {'error': 'Authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    messages = Message.objects.filter(
        Q(sender_id=logged_in_user, recipient_id=user_id) |
        Q(sender_id=user_id, recipient_id=logged_in_user)
    ).order_by('-created_at')[:50]

    data = [
        {
            'id': m.id,
            'sender_id': m.sender_id,
            'recipient_id': m.recipient_id,
            'content': m.content,
            'read_at': m.read_at,
            'created_at': m.created_at,
        }
        for m in reversed(messages)
    ]

    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def chat_contacts(request):
    user_id = get_user_id(request)
    if not user_id:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

    user_id = int(user_id)  # JWT encodes user_id as a string

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT
                    u.id AS user_id, u.username, u.name, u.avatar,
                    u.online_status, u.last_seen
                FROM accounts_user u
                WHERE u.deleted_at IS NULL
                  AND u.id IN (
                      SELECT following_id FROM accounts_follower WHERE follower_id = %s
                      UNION
                      SELECT follower_id FROM accounts_follower WHERE following_id = %s
                  )
            """, [user_id, user_id])
            columns = [col[0] for col in cursor.description]
            connections = [dict(zip(columns, row)) for row in cursor.fetchall()]
    except Exception as e:
        print(f"chat_contacts SQL error: {e}")
        connections = []

    results = []
    for conn in connections:
        avatar_url = conn.get('avatar')
        if avatar_url:
            name = str(avatar_url).lstrip('/')
            if name.startswith('media/'):
                name = name[6:]
            full_path = os.path.join(settings.MEDIA_ROOT, name)
            if not os.path.exists(full_path):
                conn['avatar'] = None

        other_id = conn['user_id']
        last_msg = Message.objects.filter(
            Q(sender_id=user_id, recipient_id=other_id) |
            Q(sender_id=other_id, recipient_id=user_id)
        ).order_by('-created_at').first()

        unread_count = Message.objects.filter(
            sender_id=other_id, recipient_id=user_id, read_at__isnull=True
        ).count()

        results.append({
            **conn,
            'last_message': last_msg.content if last_msg else None,
            'last_message_at': last_msg.created_at if last_msg else None,
            'unread_count': unread_count,
        })

    results.sort(key=lambda c: c['last_message_at'] or '', reverse=True)
    return Response(results, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_message(request, message_id):
    user_id = get_user_id(request)
    if not user_id:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

    user_id = int(user_id)

    try:
        message = Message.objects.get(id=message_id, sender_id=user_id)
    except Message.DoesNotExist:
        return Response({'error': 'Not found or not yours'}, status=status.HTTP_404_NOT_FOUND)

    last_sent_in_conversation = Message.objects.filter(
        sender_id=user_id,
        recipient_id=message.recipient_id
    ).order_by('-created_at').first()

    if not last_sent_in_conversation or last_sent_in_conversation.id != message.id:
        return Response(
            {'error': 'Only your most recent sent message in this conversation can be deleted'},
            status=status.HTTP_403_FORBIDDEN
        )

    recipient_id = message.recipient_id
    message.delete()

    # notify the recipient's open chat socket, if they have one connected
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'chat_{recipient_id}',
        {'type': 'message_deleted', 'message_id': message_id}
    )

    return Response(status=status.HTTP_204_NO_CONTENT)