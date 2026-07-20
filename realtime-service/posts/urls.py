from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.list_posts, name='list-posts'),
    path('posts/create/', views.create_post, name='create-post'),
    path('posts/<int:pk>/', views.post_detail, name='post-detail'),
    path('posts/<int:pk>/update/', views.update_post, name='update_post'),
    path('posts/<int:pk>/delete/', views.delete_post, name='delete_post'),
    path('posts/<int:pk>/like/', views.like_post, name='like-post'),
]