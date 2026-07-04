from django.urls import path
from .views import (
    UserProfileView, 
    AvatarUploadView, 
    BannerUploadView, 
    FollowView, 
    FollowersListView, 
    FollowingListView
)

urlpatterns = [
    path('users/<int:pk>/', UserProfileView.as_view(), name='user-public-profile'),
    path('users/<int:pk>/avatar/', AvatarUploadView.as_view(), name='user-avatar-upload'),
    path('users/<int:pk>/banner/', BannerUploadView.as_view(), name='user-banner-upload'),
    path('users/<int:pk>/follow/', FollowView.as_view(), name ='user-follow'),
    path('users/<int:pk>/followers/', FollowersListView.as_view(), name='user-followers'),
    path('users/<int:pk>/following/', FollowingListView.as_view(), name='user-following')
]