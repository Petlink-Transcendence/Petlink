# backend/accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    UserMeView,
    OAuth42LoginView,
    OAuth42CallbackView
)

urlpatterns = [
    # Local authentication routes
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserMeView.as_view(), name='user_me'),

    # 42 Intranet OAuth routes
    path('42/login/', OAuth42LoginView.as_view(), name='oauth_42_login'),
    path('42/callback/', OAuth42CallbackView.as_view(), name='oauth_42_callback'),
]
