from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection, models
from django.db.models import Q
from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@api_view(['GET'])
def list_notifications(request, user_id):
    notifications = Notification.objects.filter(
        user_id=user_id
    ).order_by('-created_at')

    data = [
        {
            'id': n.id,
            'actor_id': n.actor_id,
            'type': n.type,
            'content': n.content,
            'reference_id': n.reference_id,
            'reference_type': n.reference_type,
            'read': n.read,
            'created_at': n.created_at,
        }
        for n in notifications
    ]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['PUT'])
def mark_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.read = True
        notification.save()
        return Response({'status': 'marked as read'}, status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response({'error': 'not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def mark_all_read(request, user_id):
    Notification.objects.filter(user_id=user_id, read=False).update(read=True)
    return Response({'status': 'all marked as read'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_notification(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.delete()
        return Response({'status': 'deleted'}, status=status.HTTP_204_NO_CONTENT)
    except Notification.DoesNotExist:
        return Response({'error': 'not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST', 'DELETE'])
def internal_notify(request):
    user_id = request.data.get('user_id')
    actor_id = request.data.get('actor_id')
    notification_type = request.data.get('type')
    content = request.data.get('content')
    reference_id = request.data.get('reference_id')
    reference_type = request.data.get('reference_type')

    if not user_id or not notification_type:
        return Response(
            {'error': 'user_id and type are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if request.method == 'DELETE':
        deleted_count, _ = Notification.objects.filter(
            user_id=user_id,
            type=notification_type,
            reference_id=reference_id,
            reference_type=reference_type,
        ).delete()
        return Response({'status': 'deleted', 'count': deleted_count}, status=status.HTTP_200_OK)

    if not content:
        return Response(
            {'error': 'content is required for POST'},
            status=status.HTTP_400_BAD_REQUEST
        )

    notification = Notification.objects.create(
        user_id=user_id,
        actor_id=actor_id,
        type=notification_type,
        content=content,
        reference_id=reference_id,
        reference_type=reference_type,
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notifications_{user_id}',
        {
            'type': 'send_notification',
            'notification_type': notification_type,
            'content': content,
            'reference_id': reference_id,
            'reference_type': reference_type,
        }
    )

    return Response({'status': 'notification sent'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE', 'POST'])
def cleanup_user_notifications(request, user_id):
    """
    Deletes all notifications, messages, posts, comments, and likes related to a specific user_id.
    """
    try:
        from chat.models import Message
        from posts.models import Post, Like, Comment

        # Delete chat messages where user is sender or recipient
        Message.objects.filter(Q(sender_id=user_id) | Q(recipient_id=user_id)).delete()

        # Delete likes & comments related to user or user's posts
        Like.objects.filter(Q(user_id=user_id) | Q(post__user_id=user_id)).delete()
        Comment.objects.filter(Q(user_id=user_id) | Q(post__user_id=user_id)).delete()

        # Delete posts created by user
        Post.objects.filter(user_id=user_id).delete()

        # Delete notifications where recipient or actor is user_id
        q_filter = Q(user_id=user_id) | Q(actor_id=user_id) | Q(reference_type='user', reference_id=user_id)

        deleted_count, _ = Notification.objects.filter(q_filter).delete()
        return Response({'status': 'cleaned up', 'deleted_count': deleted_count}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)