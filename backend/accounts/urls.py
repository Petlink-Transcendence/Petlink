# backend/accounts/urls.py

from django.urls import path
from .views import (
    RegisterView,
    ThrottledTokenObtainPairView,
    UserMeView,
    OAuth42LoginView,
    OAuth42CallbackView,
    SetRoleView,
    UserProfileView,
    AvatarUploadView,
    BannerUploadView,
    AdminUserListView,
    AdminUserRoleUpdateView,
    AdminUserDeleteView,
    AdminUserActivateView,
    LogoutView,
    AdminStatsView,
    ChangePasswordView,
    RoleTokenRefreshView,
)

urlpatterns = [
    # Authentication & OAuth Routes
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', ThrottledTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('token/refresh/', RoleTokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserMeView.as_view(), name='user_me'),
    path('set-role/', SetRoleView.as_view(), name='set_role'),
    path('password/change/', ChangePasswordView.as_view(), name='password_change'),

    # 42 Intranet OAuth
    path('42/login/', OAuth42LoginView.as_view(), name='oauth_42_login'),
    path('42/callback/', OAuth42CallbackView.as_view(), name='oauth_42_callback'),

    # Admin Management Routes
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('users/<int:pk>/role/', AdminUserRoleUpdateView.as_view(), name='admin-user-role'),
    path('users/<int:pk>/activate/', AdminUserActivateView.as_view(), name='admin-user-activate'),
    path('users/<int:pk>/delete/', AdminUserDeleteView.as_view(), name='admin-user-delete'),

    # Public Profile Routes
    path('users/<int:pk>/', UserProfileView.as_view(), name='user-public-profile'),
    path('users/<int:pk>/avatar/', AvatarUploadView.as_view(), name='user-avatar-upload'),
    path('users/<int:pk>/banner/', BannerUploadView.as_view(), name='user-banner-upload')
]
