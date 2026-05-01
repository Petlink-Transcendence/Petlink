# backend/core/urls.py

"""
Main URL configuration for the PetLink project.
Routes the request to the appropriate app-level URL configuration.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),
]
