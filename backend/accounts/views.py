import os
import requests
from django.shortcuts import redirect, get_object_or_404
from django.core.files.base import ContentFile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from rest_framework.parsers import MultiPartParser
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer, UserProfileSerializer, UserPublicProfileSerializer,
    UserProfileUpdateSerializer, AvatarUploadSerializer, BannerUploadSerializer,
    UserOnlineStatusSerializer, ChangePasswordSerializer,
    RoleTokenObtainPairSerializer, RoleTokenRefreshSerializer
)
from .permissions import IsOwnerAdminModeratorOrReadOnly, IsAdmin
from .models import Follower
from django.db import models

try:
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync
except ImportError:
    get_channel_layer = None
    async_to_sync = None

User = get_user_model()

class RegisterRateThrottle(AnonRateThrottle):
    scope = 'register'

class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'

class RegisterView(generics.CreateAPIView):
    """API view to handle user registration"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    throttle_classes = [RegisterRateThrottle]

class ThrottledTokenObtainPairView(TokenObtainPairView):
    """API view to handle user login with rate limiting"""
    serializer_class = RoleTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"error": "Invalid username or password."}, status=status.HTTP_200_OK)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class RoleTokenRefreshView(TokenRefreshView):
    serializer_class = RoleTokenRefreshSerializer

class UserMeView(APIView):
    """API view to retrieve the logged-in user's data"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Returns the serialized data of the user making the request"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def delete(self, request):
        """Hard delete the logged-in user"""
        user = request.user
        
        if not user.oauth_provider:
            password = request.data.get('password')
            if not password or not user.check_password(password):
                return Response({"detail": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SetRoleView(APIView):
    """API view to set user_type for newly created users via 42 OAuth"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        new_role = request.data.get('user_type')
        
        if new_role not in ['owner', 'provider']:
            return Response({"error": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)
            
        user.user_type = new_role
        user.save()
        return Response({"message": f"Role successfully updated to {new_role}."})

class OAuth42LoginView(APIView):
    """
    Outbound Route: React calls this view to discover the official
    42 login URL. We build the URL and return it.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        client_id = os.environ.get('FT_CLIENT_ID')
        redirect_uri = os.environ.get('FT_REDIRECT_URI')
        url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
        return Response({"url": url})

class OAuth42CallbackView(APIView):
    """
    Inbound Route: 42 redirects the user here with a 'code'.
    We exchange this 'code' for the student's data and generate our JWT.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({"error": "Code not provided by 42"}, status=400)

        token_data = {
            'grant_type': 'authorization_code',
            'client_id': os.environ.get('FT_CLIENT_ID'),
            'client_secret': os.environ.get('FT_CLIENT_SECRET'),
            'code': code,
            'redirect_uri': os.environ.get('FT_REDIRECT_URI'),
        }
        token_res = requests.post("https://api.intra.42.fr/oauth/token", data=token_data)

        if not token_res.ok:
            return Response({"error": "Failed to authenticate with 42"}, status=400)

        access_token = token_res.json().get('access_token')

        headers = {'Authorization': f'Bearer {access_token}'}
        user_res = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
        user_data = user_res.json()

        ft_login = user_data.get('login')
        email = user_data.get('email')

        user, created = User.all_objects.get_or_create(
            username=ft_login,
            defaults={
                'email': email,
                'name': user_data.get('displayname', ft_login),
                'user_type': 'owner',
                'oauth_provider': '42',
                'oauth_id': str(user_data.get('id')),
            }
        )

        if not created and user.deleted_at:
            return redirect("https://localhost:5173/login?error=account_deleted")

        if created:
            user.set_unusable_password()
            
            # Extract and save profile picture
            image_url = user_data.get('image', {}).get('link') or user_data.get('image_url')
            if image_url:
                try:
                    img_res = requests.get(image_url, timeout=5)
                    if img_res.ok:
                        user.avatar.save(f"{ft_login}_42_avatar.jpg", ContentFile(img_res.content), save=False)
                except requests.RequestException:
                    pass
            
            user.save()

        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role

        is_new = str(created).lower()
        frontend_url = f"https://localhost:5173/oauth/callback?access={refresh.access_token}&refresh={refresh}&is_new={is_new}"
        return redirect(frontend_url)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """API view to handle public user profile requests"""
    queryset = User.objects.all()
    permission_classes = [IsOwnerAdminModeratorOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserPublicProfileSerializer
        return UserProfileUpdateSerializer

class AvatarUploadView(APIView):
    """View to handle user avatar uploads"""
    permission_classes = [IsOwnerAdminModeratorOrReadOnly]
    parser_classes = [MultiPartParser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        self.check_object_permissions(request, user)
        serializer = AvatarUploadSerializer(user, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class BannerUploadView(APIView):
    """View to handle user profile banner uploads"""
    permission_classes = [IsOwnerAdminModeratorOrReadOnly]
    parser_classes = [MultiPartParser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        self.check_object_permissions(request, user)
        serializer = BannerUploadSerializer(user, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class AdminUserListView(APIView):
    """Admin-only endpoint to list all users with optional filtering"""
    permission_classes = [IsAdmin]

    def get(self, request):
        users = User.all_objects.all()

        role = request.query_params.get('role')
        user_type = request.query_params.get('user_type')
        is_active = request.query_params.get('is_active')

        if role:
            users = users.filter(role=role)
        if user_type:
            users = users.filter(user_type=user_type)
        if is_active is not None:
            is_active_bool = str(is_active).lower() in ['true', '1', 't']
            users = users.filter(is_active=is_active_bool)

        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)

class AdminUserRoleUpdateView(APIView):
    """Admin-only endpoint to change a user's role"""
    permission_classes = [IsAdmin]

    def put(self, request, pk):
        user = get_object_or_404(User.all_objects, pk=pk)
        new_role = request.data.get('role')

        valid_roles = [choice[0] for choice in User.Role.choices]
        if new_role not in valid_roles:
            return Response({"error": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)

        user.role = new_role
        user.save()
        return Response({"message": f"Role successfully updated to {new_role}."})

class AdminUserDeleteView(APIView):
    """Admin-only endpoint to apply a soft delete to a user"""
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        user = get_object_or_404(User.all_objects, pk=pk)

        if user.deleted_at:
            return Response({"error": "User is already deleted."}, status=status.HTTP_400_BAD_REQUEST)

        user.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminUserActivateView(APIView):
    """Admin-only endpoint to reactivate a soft-deleted user"""
    permission_classes = [IsAdmin]

    def put(self, request, pk):
        user = get_object_or_404(User.all_objects, pk=pk)

        if not user.deleted_at:
            return Response({"error": "User is already active."}, status=status.HTTP_400_BAD_REQUEST)

        user.reactivate()
        return Response({"message": "User reactivated successfully."})

class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            target = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_200_OK)
        
        if target == request.user:
            return Response({"error": "You cannot connect with yourself."}, status=status.HTTP_200_OK)

        _, created = Follower.objects.get_or_create(follower=request.user, following=target)

        # Broadcast real-time WebSocket event
        try:
            if callable(get_channel_layer) and async_to_sync:
                channel_layer = get_channel_layer()
                if channel_layer:
                    event_data = {
                        'type': 'connection_updated',
                        'action': 'follow',
                        'follower_id': request.user.id,
                        'following_id': target.id,
                        'content': f"{request.user.name or request.user.username} connected with you."
                    }
                    async_to_sync(channel_layer.group_send)(f'notifications_{target.id}', event_data)
                    async_to_sync(channel_layer.group_send)(f'notifications_{request.user.id}', event_data)
        except Exception:
            pass

        # Persist a notification for the target user (only on a new follow, not repeat)
        if created:
            try:
                sender_name = request.user.name or request.user.username
                requests.post(
                    'http://realtime-service:8001/internal/notify/',
                    json={
                        'user_id': target.id,
                        'type': 'new_connection',
                        'content': f'{sender_name} connected with you.',
                        'reference_id': request.user.id,
                        'reference_type': 'user',
                    },
                    timeout=2,
                )
            except Exception:
                pass

        return Response(status=204)

    def delete(self, request, pk):
        try:
            target = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_200_OK)
        
        # If they are mutually connected, removing the connection should remove both follow requests
        was_connected = Follower.objects.filter(follower=request.user, following=target).exists() and \
                        Follower.objects.filter(follower=target, following=request.user).exists()
                        
        Follower.objects.filter(follower=request.user, following=target).delete()
        if was_connected:
            Follower.objects.filter(follower=target, following=request.user).delete()

        # Remove the notification
        try:
            requests.delete(
                'http://realtime-service:8001/internal/notify/',
                json={
                    'user_id': target.id,
                    'actor_id': request.user.id,
                    'type': 'new_connection',
                    'reference_id': request.user.id,
                    'reference_type': 'user',
                },
                timeout=2,
            )
            if was_connected:
                requests.delete(
                    'http://realtime-service:8001/internal/notify/',
                    json={
                        'user_id': request.user.id,
                        'actor_id': target.id,
                        'type': 'new_connection',
                        'reference_id': target.id,
                        'reference_type': 'user',
                    },
                    timeout=2,
                )
        except Exception:
            pass
        # Broadcast real-time WebSocket event
        try:
            if callable(get_channel_layer) and async_to_sync:
                channel_layer = get_channel_layer()
                if channel_layer:
                    event_data = {
                        'type': 'connection_updated',
                        'action': 'unfollow',
                        'follower_id': request.user.id,
                        'following_id': target.id,
                        'content': f"{request.user.name or request.user.username} unfollowed you."
                    }
                    async_to_sync(channel_layer.group_send)(f'notifications_{target.id}', event_data)
                    async_to_sync(channel_layer.group_send)(f'notifications_{request.user.id}', event_data)
        except Exception:
            pass

        return Response(status=204)

class FollowersListView(generics.ListAPIView):
    serializer_class = UserPublicProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = get_object_or_404(User, pk=self.kwargs['pk'])
        return User.objects.filter(following__following=user)

class FollowingListView(generics.ListAPIView):
    serializer_class = UserPublicProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = get_object_or_404(User, pk=self.kwargs['pk'])
        return User.objects.filter(followers__follower=user)

class UserSearchView(generics.ListAPIView):
    serializer_class = UserPublicProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('q', '').strip()
        user_type = self.request.query_params.get('user_type', '').strip().lower()
        users = User.objects.exclude(role=User.Role.ADMIN).exclude(is_superuser=True)
        if self.request.user.is_authenticated:
            users = users.exclude(pk=self.request.user.pk)

        if user_type in {User.UserType.OWNER, User.UserType.PROVIDER}:
            users = users.filter(user_type=user_type)

        if not query:
            return users.order_by('name')

        normalized_query = query.lower()
        role_alias = None
        if any(term in normalized_query for term in ('sitter', 'walker', 'provider')):
            role_alias = 'provider'
        elif 'owner' in normalized_query:
            role_alias = 'owner'

        search_terms = [term for term in query.replace(',', ' ').split() if term]
        if role_alias:
            search_terms = [
                term for term in search_terms
                if term.lower() not in {'pet', 'sitter', 'walker', 'provider', 'owner'}
            ]

        search_filter = models.Q()
        for term in search_terms:
            term_filter = (
                models.Q(name__icontains=term) |
                models.Q(username__icontains=term) |
                models.Q(city__icontains=term) |
                models.Q(country__icontains=term) |
                models.Q(user_type__icontains=term) |
                models.Q(role__icontains=term)
            )
            search_filter &= term_filter

        if role_alias:
            search_filter &= models.Q(user_type=role_alias)

        return users.filter(search_filter).order_by('name')

class SuggestedConnectionsView(generics.ListAPIView):
    """
    Returns random user profiles from the DB which aren't yet connections of the signed-in account.
    """
    serializer_class = UserPublicProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = User.objects.exclude(role=User.Role.ADMIN).exclude(is_superuser=True)
        if self.request.user.is_authenticated:
            queryset = queryset.exclude(id=self.request.user.id)
            following_ids = Follower.objects.filter(follower=self.request.user).values_list('following_id', flat=True)
            queryset = queryset.exclude(id__in=following_ids)

        limit_param = self.request.query_params.get('limit', '5')
        try:
            limit = int(limit_param)
        except ValueError:
            limit = 5

        return queryset.order_by('?')[:limit]

class UserOnlineStatusView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserOnlineStatusSerializer
    permission_classes = [AllowAny]

class LogoutView(APIView):
    """
    Invalidates the refresh token, blacklisting it.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class AdminStatsView(APIView):
    """
    Admin-only endpoint to retrieve stats for the dashboard:
    - total users (active/non-deleted users)
    - active bookings (status = 'confirmed')
    - pending bookings (status = 'pending')
    - total reviews
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        from bookings.models import Booking, Review
        
        total_users = User.objects.count()
        active_bookings = Booking.objects.filter(status=Booking.Status.CONFIRMED).count()
        pending_bookings = Booking.objects.filter(status=Booking.Status.PENDING).count()
        total_reviews = Review.objects.count()

        return Response({
            "total_users": total_users,
            "active_bookings": active_bookings,
            "pending_bookings": pending_bookings,
            "total_reviews": total_reviews
        }, status=status.HTTP_200_OK)

class DeleteMeView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.name = 'Deleted User'
        user.email = f'deleted_{user.id}@deleted.com'
        user.username = f'deleted_{user.id}'
        user.avatar = None
        user.banner = None
        user.description = None
        user.soft_delete()
        return Response(status=204)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            if user.oauth_provider:
                return Response({"detail": "Password change is not available for OAuth users."}, status=status.HTTP_400_BAD_REQUEST)

            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
