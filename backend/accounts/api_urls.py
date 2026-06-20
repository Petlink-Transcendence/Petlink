from django.urls import path
from .views import UserProfileView, AvatarUploadView, BannerUploadView

urlpatterns = [
    path('users/<int:pk>/', UserProfileView.as_view(), name='user-public-profile'),
    path('users/<int:pk>/avatar/', AvatarUploadView.as_view(), name='user-avatar-upload'),
    path('users/<int:pk>/banner/', BannerUploadView.as_view(), name='user-banner-upload')
]