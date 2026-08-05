from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import Message
from django.db.models import Q

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

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT
                    u.user_id, u.username, u.name, u.avatar,
                    u.online_status, u.last_seen
                FROM "user" u
                WHERE u.deleted_at IS NULL
                  AND u.user_id IN (
                      SELECT following_id FROM followers WHERE follower_id = %s
                      UNION
                      SELECT follower_id FROM followers WHERE following_id = %s
                  )
            """, [user_id, user_id])
            columns = [col[0] for col in cursor.description]
            connections = [dict(zip(columns, row)) for row in cursor.fetchall()]
    except Exception:
        connections = []

    results = []
    for conn in connections:
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

    message.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)