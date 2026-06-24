from rest_framework import permissions
from .models import UserPet

class IsPetOwnerOrReadOnly(permissions.BasePermission):
    """Check if the user is the Pet Owner"""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        """Return true the user is the pet owner"""
        return request.user.is_authenticated and UserPet.objects.filter(user=request.user, pet=obj).exists()