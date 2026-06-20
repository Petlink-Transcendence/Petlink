from django.urls import path
from .views import PetCreateView

urlpatterns = [
    path('pets/', PetCreateView.as_view(), name='pet-create')
]