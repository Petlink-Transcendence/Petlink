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
from .permissions import IsOwnerOrReadOnly
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser

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
        # request.user is automatically populated by SimpleJWT if the token is valid
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

        # Build the 42 authorization link
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

        # 1. Exchange the 'code' for the 42 Access Token
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

        # 2. Use the 42 token to fetch cadet data
        headers = {'Authorization': f'Bearer {access_token}'}
        user_res = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
        user_data = user_res.json()

        # 3. Create or get the user in OUR database (PetLink)
        ft_login = user_data.get('login')
        email = user_data.get('email')

        # get_or_create is perfect here: if it doesn't exist, it creates it!
        user, created = User.objects.get_or_create(
            username=ft_login,
            defaults={
                'email': email,
                'name': user_data.get('displayname', ft_login),
                'user_type': 'owner',  # Everyone from 42 starts as 'owner' by default
                'oauth_provider': '42',
                'oauth_id': str(user_data.get('id')),
            }
        )

        if created:
            user.set_unusable_password()
            user.save()

        # 4. Generate OUR PetLink JWT token for this user
        refresh = RefreshToken.for_user(user)

        # 5. Redirect back to React delivering the tokens!
        frontend_url = f"http://localhost:5173/oauth/callback?access={refresh.access_token}&refresh={refresh}"
        return redirect(frontend_url)
class UserProfileView(generics.RetrieveUpdateAPIView):
    """API view to handle public user requests"""
    queryset = User.objects.all()
    permission_classes = [IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserPublicProfileSerializer
        return UserProfileUpdateSerializer

class AvatarUploadView(APIView):
    """View to upload files"""
    permission_classes = [IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        self.check_object_permissions(request, user)
        serializer = AvatarUploadSerializer(user, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class BannerUploadView(APIView):
    """View to upload files"""
    permission_classes = [IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        self.check_object_permissions(request, user)
        serializer = BannerUploadSerializer(user, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
