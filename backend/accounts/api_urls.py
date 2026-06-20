from django.urls import path
from .views import UserProfileView

urlpatterns = [
    path('users/<int:pk>/', UserProfileView.as_view(), name='user-public-profile'),
]