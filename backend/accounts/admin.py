from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Follower


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'name', 'user_type', 'role', 'online_status', 'deleted_at')
    list_filter = ('user_type', 'role', 'online_status')
    search_fields = ('username', 'email', 'name')
    ordering = ('-date_joined',)
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('name', 'user_type', 'role', 'avatar', 'banner', 'description', 'country', 'city', 'rating')}),
        ('Sitter Info', {'fields': ('experience', 'price', 'pet_types', 'looking_for', 'availability_status')}),
        ('Status', {'fields': ('online_status', 'last_seen', 'deleted_at')}),
        ('OAuth', {'fields': ('oauth_provider', 'oauth_id')}),
    )


@admin.register(Follower)
class FollowerAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following')
    search_fields = ('follower__username', 'following__username')
