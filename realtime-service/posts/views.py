from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Post, Like

def get_user_id(request):
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    try:
        token = AccessToken(auth.split(' ')[1])
        return token['user_id']
    except (InvalidToken, TokenError):
        return None

@api_view(['POST'])
@parser_classes([MultiPartParser])
def create_post(request):
    user_id = get_user_id(request)
    if not user_id:
        return Response({'error': 'Authentication required'}, status=401)
    purpose = request.data.get('purpose')
    if not purpose:
        return Response({'error': 'purpose is required'}, status=status.HTTP_400_BAD_REQUEST)
    image = request.FILES.get('image')
    if image:
        allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if image.content_type not in allowed:
            return Response({'error': 'Invalid file type'}, status=400)
        if image.size > 5 * 1024 * 1024:
            return Response({'error': 'File too large'}, status=400)
    post = Post.objects.create(
        user_id=user_id,
        purpose=purpose,
        text=request.data.get('text'),
        tags=request.data.get('tags'),
        pet_type=request.data.get('pet_type'),
        pet_size=request.data.get('pet_size'),
        image=image,
    )
    return Response({
        'id': post.id,
        'user_id': post.user_id,
        'purpose': post.purpose,
        'text': post.text,
        'tags': post.tags,
        'pet_type': post.pet_type,
        'pet_size': post.pet_size,
        'image': request.build_absolute_uri(post.image.url) if post.image else None,
        'created_at': post.created_at,
    }, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@parser_classes([MultiPartParser])
def update_post(request, pk):
    user_id = get_user_id(request)
    if not user_id:
        return Response({'error': 'Authentication required'}, status=401)
    post = get_object_or_404(Post, pk=pk)
    if post.user_id != user_id:
        return Response({'error': 'Not allowed'}, status=403)
    image = request.FILES.get('image')
    if image:
        allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if image.content_type not in allowed:
            return Response({'error': 'Invalid file type'}, status=400)
        if image.size > 5 * 1024 * 1024:
            return Response({'error': 'File too large'}, status=400)
        post.image = image
    post.purpose = request.data.get('purpose', post.purpose)
    post.text = request.data.get('text', post.text)
    post.pet_type = request.data.get('pet_type', post.pet_type)
    post.pet_size = request.data.get('pet_size', post.pet_size)
    post.save()
    return Response({
        'id': post.id,
        'user_id': post.user_id,
        'purpose': post.purpose,
        'text': post.text,
        'pet_type': post.pet_type,
        'pet_size': post.pet_size,
        'image': request.build_absolute_uri(post.image.url) if post.image else None,
        'created_at': post.created_at,
    })

@api_view(['DELETE'])
def delete_post(request, pk):
    user_id = get_user_id(request)
    if not user_id:
        return Response({'error': 'Authentication required'}, status=401)
    post = get_object_or_404(Post, pk=pk)
    if post.user_id != user_id:
        return Response({'error': 'Not allowed'}, status=403)
    post.delete()
    return Response(status=204)