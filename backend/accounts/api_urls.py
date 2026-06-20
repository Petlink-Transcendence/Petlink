from django.urls import path
from .views import UserProfileView, AvatarUploadView

urlpatterns = [
    path('users/<int:pk>/', UserProfileView.as_view(), name='user-public-profile'),
    path('users/<int:pk>/avatar/', AvatarUploadView.as_view(), name='user-avatar-upload')
]