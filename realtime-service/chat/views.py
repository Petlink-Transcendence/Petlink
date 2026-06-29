from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Message
from django.db.models import Q

@api_view(['GET'])
def message_history(request, user_id):
    logged_in_user = request.query_params.get('sender_id')

    if not logged_in_user:
        return Response(
            {'error': 'sender_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    messages = Message.objects.filter(
        Q(sender_id=logged_in_user, recipient_id=user_id) |
        Q(sender_id=user_id, recipient_id=logged_in_user)
    ).order_by('created_at')[:50]

    data = [
        {
            'id': m.id,
            'sender_id': m.sender_id,
            'recipient_id': m.recipient_id,
            'content': m.content,
            'read_at': m.read_at,
            'created_at': m.created_at,
        }
        for m in messages
    ]

    return Response(data, status=status.HTTP_200_OK)