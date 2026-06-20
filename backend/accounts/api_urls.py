from django.urls import path
from .views import UserPublicProfileView

urlpatterns = [
    path('users/<int:pk>/', UserPublicProfileView.as_view(), name='user-public-profile'),
]