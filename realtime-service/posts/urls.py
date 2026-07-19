from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.create_post, name='create-post'),
    path('posts/<int:pk>/', views.update_post, name='post-update'),
    path('posts/<int:pk>/delete/', views.delete_post, name='post-delete'),
]