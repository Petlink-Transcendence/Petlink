from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
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
