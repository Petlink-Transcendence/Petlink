import os
import requests
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer, UserProfileSerializer, UserPublicProfileSerializer,
    UserProfileUpdateSerializer, AvatarUploadSerializer, BannerUploadSerializer
)
from .permissions import IsOwnerAdminModeratorOrReadOnly
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser
from .models import Follower

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """API view to handle user registration"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

class UserMeView(APIView):
    """API view to retrieve the logged-in user's data"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Returns the serialized data of the user making the request"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

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

        user, created = User.objects.get_or_create(
            username=ft_login,
            defaults={
                'email': email,
                'name': user_data.get('displayname', ft_login),
                'user_type': 'owner',
                'oauth_provider': '42',
                'oauth_id': str(user_data.get('id')),
            }
        )

        if created:
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)

        frontend_url = f"http://localhost:5173/oauth/callback?access={refresh.access_token}&refresh={refresh}"
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

class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        target = get_object_or_404(User, pk=pk)
        Follower.objects.get_or_create(follower=request.user, following=target)
        return Response(status=204)

    def delete(self, request, pk):
        target = get_object_or_404(User, pk=pk)
        Follower.objects.filter(follower=request.user, following=target).delete()
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