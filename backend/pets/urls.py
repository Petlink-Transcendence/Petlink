from django.urls import path
from .views import PetCreateView, UserPetListView, PetDetailView

urlpatterns = [
    path('pets/', PetCreateView.as_view(), name='pet-create'),
    path('users/<int:pk>/pets/', UserPetListView.as_view(), name='users-pet-list'),
    path('pets/<int:pk>/', PetDetailView.as_view(), name='pet-detail')
]