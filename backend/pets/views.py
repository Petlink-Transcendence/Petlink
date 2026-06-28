from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Pet, UserPet
from .serializers import PetSerializer
from .permissions import IsPetOwnerOrReadOnly

class PetCreateView(generics.CreateAPIView):
    """View for Create Pet"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        pet = serializer.save()
        UserPet.objects.create(user=self.request.user, pet=pet)

class UserPetListView(generics.ListAPIView):
    """View for user pets list"""
    serializer_class = PetSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_pet_links = UserPet.objects.filter(user_id=self.kwargs['pk'])
        pet_ids = user_pet_links.values_list('pet_id', flat=True)
        return Pet.objects.filter(id__in=pet_ids)
    
class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for update/delete pet"""
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [IsPetOwnerOrReadOnly]