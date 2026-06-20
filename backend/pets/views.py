from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Pet, UserPet
from .serializers import PetSerializer

class PetCreateView(generics.CreateAPIView):
    """View for Create Pet"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        pet = serializer.save()
        UserPet.objects.create(user=self.request.user, pet=pet)