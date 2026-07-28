from django.urls import path
from .views import (
    UserProfileView, 
    AvatarUploadView, 
    BannerUploadView, 
    FollowView, 
    FollowersListView, 
    FollowingListView,
    UserOnlineStatusView,
    UserSearchView,
    SuggestedConnectionsView,
    AdminStatsView,
    DeleteMeView
)

urlpatterns = [
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/suggested/', SuggestedConnectionsView.as_view(), name='user-suggested'),
    path('users/<int:pk>/', UserProfileView.as_view(), name='user-public-profile'),
    path('users/<int:pk>/avatar/', AvatarUploadView.as_view(), name='user-avatar-upload'),
    path('users/<int:pk>/banner/', BannerUploadView.as_view(), name='user-banner-upload'),
    path('users/<int:pk>/follow/', FollowView.as_view(), name ='user-follow'),
    path('users/<int:pk>/followers/', FollowersListView.as_view(), name='user-followers'),
    path('users/<int:pk>/following/', FollowingListView.as_view(), name='user-following'),
    path('users/<int:pk>/online/', UserOnlineStatusView.as_view(), name='user-online-status'),
    path('users/', UserSearchView.as_view(), name='user-search'),
    path('users/me/delete/', DeleteMeView.as_view(), name='user-delete-me'),
]