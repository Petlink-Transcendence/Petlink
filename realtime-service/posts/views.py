import os
import json
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.utils import timezone
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.conf import settings
from django.db import connection
from .models import Post, Like, Comment
from notifications.models import Notification

def get_user_display_name(user_id):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT name, username FROM accounts_user WHERE id = %s", [user_id])
            row = cursor.fetchone()
            if row:
                name, username = row[0], row[1]
                return name or username or "Someone"
    except Exception:
        pass
    return "Someone"

def is_post_image_deleted(image):
    if not image or not bool(image):
        return False
    name = getattr(image, 'name', None)
    if not name:
        return False

    try:
        if hasattr(image, 'storage') and image.storage and not image.storage.exists(name):
            return True
    except Exception:
        pass

    try:
        if hasattr(image, 'path') and image.path and not os.path.exists(image.path):
            return True
    except Exception:
        pass

    try:
        full_path = os.path.join(settings.MEDIA_ROOT, name)
        if not os.path.exists(full_path):
            return True
    except Exception:
        pass

    return False

def get_user_id(request):
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    try:
        token = AccessToken(auth.split(' ')[1])
        return int(token['user_id'])
    except (InvalidToken, TokenError, ValueError, TypeError):
        return None

def broadcast_post_update(post_id, user_id, action):
    try:
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                'global_notifications',
                {
                    'type': 'post_updated',
                    'action': action,
                    'post_id': post_id,
                    'user_id': user_id,
                }
            )
    except Exception:
        pass

def build_image_url(image, request):
    if not image or is_post_image_deleted(image):
        return None
    url = request.build_absolute_uri(image.url)
    if request.is_secure() or request.headers.get('X-Forwarded-Proto') == 'https':
        return url.replace('http://', 'https://', 1)
    return url

def is_admin(request):
    """Return whether the signed access token belongs to an admin user."""
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return False
    try:
        token = AccessToken(auth.split(' ')[1])
        return token.get('role') == 'admin'
    except (InvalidToken, TokenError, ValueError, TypeError):
        return False

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
    tags_raw = request.data.get('tags')
    try:
        tags = json.loads(tags_raw) if tags_raw else None
    except (ValueError, TypeError):
        tags = None

    text = request.data.get('text', '') or ''
    if len(text) > 512:
        return Response({'error': 'Post description exceeds maximum length of 512 characters'}, status=400)

    post = Post.objects.create(
        user_id=user_id,
        purpose=purpose,
        text=text,
        tags=tags,
        pet_type=request.data.get('pet_type'),
        pet_size=request.data.get('pet_size'),
        image=image,
    )
    broadcast_post_update(post.id, post.user_id, 'created')
    return Response({
        'id': post.id,
        'user_id': post.user_id,
        'purpose': post.purpose,
        'text': post.text,
        'tags': post.tags,
        'pet_type': post.pet_type,
        'pet_size': post.pet_size,
        'image': build_image_url(post.image, request),
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
    new_text = request.data.get('text', post.text)
    if new_text and len(new_text) > 512:
        return Response({'error': 'Post description exceeds maximum length of 512 characters'}, status=400)
    post.purpose = request.data.get('purpose', post.purpose)
    post.text = new_text
    post.pet_type = request.data.get('pet_type', post.pet_type)
    post.pet_size = request.data.get('pet_size', post.pet_size)
    post.save()
    broadcast_post_update(post.id, post.user_id, 'updated')
    return Response({
        'id': post.id,
        'user_id': post.user_id,
        'purpose': post.purpose,
        'text': post.text,
        'pet_type': post.pet_type,
        'pet_size': post.pet_size,
        'image': build_image_url(post.image, request),
        'created_at': post.created_at,
    })

@api_view(['DELETE'])
def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk, deleted_at__isnull=True)
    user_id = get_user_id(request)
    if post.image and is_post_image_deleted(post.image):
        post.deleted_at = timezone.now()
        post.save()
        broadcast_post_update(post.id, post.user_id, 'deleted')
        return Response({'status': 'post deleted'}, status=status.HTTP_200_OK)

    if not user_id:
        return Response({'error': 'Authentication required'}, status=401)
    if post.user_id != user_id and not is_admin(request):
        return Response({'error': 'Not allowed'}, status=403)
        
    post.deleted_at = timezone.now()
    post.save()
    Notification.objects.filter(reference_type='post', reference_id=post.id).delete()
    broadcast_post_update(post.id, post.user_id, 'deleted')
    return Response({'status': 'post deleted'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def user_post_count(request):
    user_id_param = request.query_params.get('user_id')
    try:
        uid = int(user_id_param)
    except (ValueError, TypeError):
        return Response({'count': 0})
    count = Post.objects.filter(user_id=uid, deleted_at__isnull=True).count()
    return Response({'count': count})

@api_view(['GET'])
def list_posts(request):
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 10))
    offset = (page - 1) * page_size

    queryset = Post.objects.filter(deleted_at__isnull=True)

    user_id_param = request.query_params.get('user_id')
    if user_id_param:
        if user_id_param == 'me':
            current_uid = get_user_id(request)
            if current_uid:
                queryset = queryset.filter(user_id=current_uid)
            else:
                return Response([], status=status.HTTP_200_OK)
        else:
            try:
                queryset = queryset.filter(user_id=int(user_id_param))
            except (ValueError, TypeError):
                queryset = queryset.filter(user_id=user_id_param)

    all_posts = queryset[offset:offset + page_size]

    user_id = get_user_id(request)
    data = []
    for p in all_posts:
        if p.image and is_post_image_deleted(p.image):
            p.deleted_at = timezone.now()
            p.save()
            broadcast_post_update(p.id, p.user_id, 'deleted')
            continue

        data.append({
            'id': p.id,
            'user_id': p.user_id,
            'purpose': p.purpose,
            'text': p.text,
            'tags': p.tags,
            'pet_type': p.pet_type,
            'pet_size': p.pet_size,
            'image': build_image_url(p.image, request),
            'like_count': p.likes.count(),
            'user_liked': p.likes.filter(user_id=user_id).exists() if user_id else False,
            'created_at': p.created_at,
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def post_detail(request, pk):
    try:
        post = Post.objects.get(id=pk, deleted_at__isnull=True)
    except Post.DoesNotExist:
        return Response({'error': 'not found'}, status=status.HTTP_404_NOT_FOUND)

    if post.image and is_post_image_deleted(post.image):
        post.deleted_at = timezone.now()
        post.save()
        broadcast_post_update(post.id, post.user_id, 'deleted')
        return Response({'error': 'not found'}, status=status.HTTP_404_NOT_FOUND)

    user_id = get_user_id(request)
    user_liked = False
    if user_id:
        user_liked = Like.objects.filter(post=post, user_id=user_id).exists()

    return Response({
        'id': post.id,
        'user_id': post.user_id,
        'purpose': post.purpose,
        'text': post.text,
        'tags': post.tags,
        'pet_type': post.pet_type,
        'pet_size': post.pet_size,
        'image': build_image_url(post.image, request),
        'like_count': post.likes.count(),
        'user_liked': user_liked,
        'created_at': post.created_at,
    }, status=status.HTTP_200_OK)

@api_view(['POST', 'DELETE'])
def like_post(request, pk):
    user_id = get_user_id(request)
    if not user_id:
        return Response({'error': 'Authentication required'}, status=401)
    
    post = get_object_or_404(Post, pk=pk, deleted_at__isnull=True)

    if request.method == 'POST':
        like, created = Like.objects.get_or_create(user_id=user_id, post=post)
        if not created:
            return Response({'error': 'already liked'}, status=status.HTTP_400_BAD_REQUEST)

        # Notify the post owner — skip if the liker IS the owner
        if post.user_id != user_id:
            try:
                user_name = get_user_display_name(user_id)
                notif = Notification.objects.create(
                    user_id=post.user_id,
                    actor_id=user_id,
                    type='new_like',
                    content=f'{user_name} liked your post.',
                    reference_id=post.id,
                    reference_type='post',
                )
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f'notifications_{post.user_id}',
                    {
                        'type': 'send_notification',
                        'notification_type': 'new_like',
                        'content': notif.content,
                        'reference_id': post.id,
                        'reference_type': 'post',
                    },
                )
            except Exception:
                pass  # never block the like action

        broadcast_post_update(post.id, post.user_id, 'liked')
        return Response({'status': 'liked'}, status=status.HTTP_201_CREATED)
    
    try:
        like = Like.objects.get(user_id=user_id, post=post)
        like.delete()
        Notification.objects.filter(
            user_id=post.user_id,
            actor_id=user_id,
            type='new_like',
            reference_id=post.id,
            reference_type='post'
        ).delete()
        broadcast_post_update(post.id, post.user_id, 'unliked')
        return Response({'status': 'unliked'}, status=status.HTTP_200_OK)
    except Like.DoesNotExist:
        return Response({'error': 'not liked'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST'])
def post_comments(request, pk):
    post = get_object_or_404(Post, pk=pk, deleted_at__isnull=True)

    if request.method == 'GET':
        comments = Comment.objects.filter(post=post, deleted_at__isnull=True)
        data = [
            {'id': c.id, 'user_id': c.user_id, 'text': c.text, 'created_at': c.created_at}
            for c in comments
        ]
        return Response(data)

    user_id = get_user_id(request)
    if not user_id:
        return Response({'error': 'Authentication required'}, status=401)
    text = request.data.get('text', '').strip()
    if not text:
        return Response({'error': 'text is required'}, status=400)
    if len(text) > 512:
        return Response({'error': 'Comment exceeds maximum length of 512 characters'}, status=400)
    comment = Comment.objects.create(user_id=user_id, post=post, text=text)

    if post.user_id != user_id:
        try:
            user_name = get_user_display_name(user_id)
            notif = Notification.objects.create(
                user_id=post.user_id,
                actor_id=user_id,
                type='new_comment',
                content=f'{user_name} commented on your post.',
                reference_id=post.id,
                reference_type='post',
            )
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'notifications_{post.user_id}',
                {'type': 'send_notification', 'notification_type': 'new_comment',
                 'content': notif.content, 'reference_id': post.id, 'reference_type': 'post'},
            )
        except Exception:
            pass

    broadcast_post_update(post.id, post.user_id, 'commented')
    return Response(
        {'id': comment.id, 'user_id': comment.user_id, 'text': comment.text, 'created_at': comment.created_at},
        status=201
    )


@api_view(['DELETE'])
def delete_comment(request, pk, comment_pk):
    user_id = get_user_id(request)
    if not user_id:
        return Response({'error': 'Authentication required'}, status=401)
    comment = get_object_or_404(Comment, pk=comment_pk, post_id=pk, deleted_at__isnull=True)
    if comment.user_id != user_id and not is_admin(request):
        return Response({'error': 'Not allowed'}, status=403)
    comment.deleted_at = timezone.now()
    comment.save()

    # Delete one associated notification if it exists
    notif = Notification.objects.filter(
        user_id=comment.post.user_id,
        actor_id=comment.user_id,
        type='new_comment',
        reference_id=comment.post.id,
        reference_type='post'
    ).first()
    if notif:
        notif.delete()

    broadcast_post_update(comment.post_id, comment.user_id, 'comment_deleted')
    return Response(status=204)
