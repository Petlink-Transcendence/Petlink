from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """Allows access for admin only"""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')


class IsModerator(BasePermission):
    """Gives access to admin or moderators"""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ['admin', 'moderator']
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Permission in object level: The user can only view/edit
    if he is owner of the object or if it is a admin
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True

        return obj == request.user
