from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Notification

@api_view(['GET'])
def list_notifications(request, user_id):
    notifications = Notification.objects.filter(
        user_id=user_id
    ).order_by('-created_at')

    data = [
        {
            'id': n.id,
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


