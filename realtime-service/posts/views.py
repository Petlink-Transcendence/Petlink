from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Post, Like

@api_view(['POST'])
def create_post(request):
    user_id = request.data.get('user_id')
    purpose = request.data.get('purpose')
    text = request.data.get('text')
    tags = request.data.get('tags')
    pet_type = request.data.get('pet_type')
    pet_size = request.data.get('pet_size')

    if not user_id or not purpose:
        return Response(
            {'error': 'user_id and purpose are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    post = Post.objects.create(
        user_id=user_id,
        purpose=purpose,
        text=text,
        tags=tags,
        pet_type=pet_type,
        pet_size=pet_size,
    )

    return Response({
        'id': post.id,
        'user_id': post.user_id,
        'purpose': post.purpose,
        'text': post.text,
        'tags': post.tags,
        'pet_type': post.pet_type,
        'pet_size': post.pet_size,
        'created_at': post.created_at,
    }, status=status.HTTP_201_CREATED)