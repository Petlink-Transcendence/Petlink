from django.urls import path
from .views import PetCreateView, UserPetListView

urlpatterns = [
    path('pets/', PetCreateView.as_view(), name='pet-create'),
    path('users/<int:pk>/pets/', UserPetListView.as_view(), name='users-pet-list')
]