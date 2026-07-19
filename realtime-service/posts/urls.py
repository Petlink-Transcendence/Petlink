from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.create_post, name='create-post'),
]