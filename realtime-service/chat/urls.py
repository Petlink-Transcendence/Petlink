from django.urls import path
from . import views

urlpatterns = [
    path('chat/messages/<int:user_id>/', views.message_history, name='message-history'),
]