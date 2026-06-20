from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer, UserProfileSerializer, UserPublicProfileSerializer, UserProfileUpdateSerializer
from .permissions import IsOwnerOrReadOnly

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

class UserProfileView(generics.RetrieveUpdateAPIView):
    """API view to handle public user requests"""
    queryset = User.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserPublicProfileSerializer
        return UserProfileUpdateSerializer