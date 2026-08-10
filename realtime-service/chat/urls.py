from django.urls import path
from . import views

urlpatterns = [
    path('chat/messages/<int:user_id>/', views.message_history, name='message-history'),
    path('chat/contacts/', views.chat_contacts, name='chat-contacts'),
    path('chat/messages/delete/<int:message_id>/', views.delete_message, name='delete-message'),
    path('chat/upload_image/', views.upload_chat_image, name='upload_chat_image'),
]