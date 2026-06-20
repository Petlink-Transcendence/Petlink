# backend/core/urls.py

"""
Main URL configuration for the PetLink project.
Routes the request to the appropriate app-level URL configuration.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    path('api/', include('accounts.api_urls')),
    path('api/', include('pets.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
