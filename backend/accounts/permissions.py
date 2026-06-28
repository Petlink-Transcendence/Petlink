from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """check if the request needs owner permissions"""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        """return true if the user is equal to the obj"""
        return obj == request.user