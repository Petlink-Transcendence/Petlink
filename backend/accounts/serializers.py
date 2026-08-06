import os
import re
import requests as http_requests
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from .models import Follower

User = get_user_model()

def _fetch_posts_count(user_id: int) -> int:
    """Ask the realtime service for a user's post count."""
    base = os.environ.get('REALTIME_SERVICE_URL', 'http://realtime-service:8001')
    try:
        resp = http_requests.get(f'{base}/posts/count/', params={'user_id': user_id}, timeout=2)
        if resp.ok:
            return resp.json().get('count', 0)
    except Exception:
        pass
    return 0

def check_avatar_exists(obj, request=None):
    if not obj.avatar or not bool(obj.avatar):
        return None
    try:
        name = getattr(obj.avatar, 'name', None)
        if name:
            full_path = os.path.join(settings.MEDIA_ROOT, name)
            if not os.path.exists(full_path):
                return None
            if hasattr(obj.avatar, 'storage') and obj.avatar.storage and not obj.avatar.storage.exists(name):
                return None
    except Exception:
        return None

    try:
        if request:
            url = request.build_absolute_uri(obj.avatar.url)
            if request.is_secure() or request.headers.get('X-Forwarded-Proto') == 'https':
                url = url.replace('http://', 'https://', 1)
            return url
        return obj.avatar.url
    except Exception:
        return None


class RoleTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Include the application role in tokens consumed by the posts service."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        refresh = RefreshToken(data['refresh'])
        refresh['role'] = self.user.role
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        return data


class RoleTokenRefreshSerializer(TokenRefreshSerializer):
    """Keep the role claim up to date when an access token is refreshed."""

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = RefreshToken(attrs['refresh'])
        user = User.all_objects.get(pk=refresh['user_id'])
        access = AccessToken(data['access'])
        access['role'] = user.role
        data['access'] = str(access)
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'name', 'user_type')

    def validate_username(self, value):
        if User.all_objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('Username already in use.')
        return value

    def validate_email(self, value):
        if User.all_objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Email already in use.')
        return value

    def validate_password(self, value):
        min_req = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$'
        if not re.match(min_req, value):
            raise serializers.ValidationError("Password must contain at least 8 chars, one lower, one upper, one number, and one special char.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'name', 'user_type', 'role', 'avatar', 'banner', 'description', 
            'city', 'country', 'rating', 'online_status', 'created_at', 'experience', 'price', 
            'sitter_pet_types', 'looking_for', 'oauth_provider', 'notify_bookings', 'notify_messages',
            'notify_reviews', 'notify_comments', 'notify_connections', 'show_about', 'show_pets', 'show_looking_for',
            'availability_status', 'availability_location', 'availability_capacity', 'available_times',
            'followers_count', 'posts_count'
        )
        read_only_fields = fields

    def get_avatar(self, obj):
        request = self.context.get('request')
        return check_avatar_exists(obj, request)

    def get_followers_count(self, obj):
        following_ids = obj.following.values_list('following_id', flat=True)
        return obj.followers.filter(follower_id__in=following_ids).count()

    def get_posts_count(self, obj):
        return _fetch_posts_count(obj.pk)

class UserPublicProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    is_connected = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'name', 'username', 'role', 'avatar', 'banner', 'description',
            'city', 'country', 'user_type', 'rating', 'followers_count', 'posts_count',
            'following_count', 'is_following', 'is_connected', 'experience', 'price',
            'sitter_pet_types', 'looking_for', 'created_at',
            'availability_status', 'availability_location', 'availability_capacity', 'available_times',
            'show_about', 'show_pets', 'show_looking_for'
        )
        read_only_fields = fields

    def get_avatar(self, obj):
        request = self.context.get('request')
        return check_avatar_exists(obj, request)

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            public_fields = {
                'id', 'name', 'username', 'role', 'user_type', 'avatar', 'banner',
                'followers_count', 'following_count', 'show_about', 'show_pets', 'show_looking_for'
            }
        else:
            public_fields = set(fields.keys()) | {'is_following', 'is_connected'}
        for field in list(fields.keys()):
            if field not in public_fields:
                fields.pop(field, None)
        return fields

    def get_followers_count(self, obj):
        following_ids = obj.following.values_list('following_id', flat=True)
        return obj.followers.filter(follower_id__in=following_ids).count()

    def get_following_count(self, obj):
        follower_ids = obj.followers.values_list('follower_id', flat=True)
        return obj.following.filter(following_id__in=follower_ids).count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return Follower.objects.filter(follower=request.user, following=obj).exists()

    def get_is_connected(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return Follower.objects.filter(follower=request.user, following=obj).exists() and \
               Follower.objects.filter(follower=obj, following=request.user).exists()

    def get_posts_count(self, obj):
        return _fetch_posts_count(obj.pk)

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150, min_length=1, required=False)
    name = serializers.CharField(max_length=100, min_length=1)
    description = serializers.CharField(max_length=500, required=False, allow_blank=True, allow_null=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    experience = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)
    price = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)
    sitter_pet_types = serializers.ListField(child=serializers.CharField(max_length=50), required=False, allow_empty=True)
    looking_for = serializers.ListField(child=serializers.CharField(max_length=50), required=False, allow_empty=True)
    notify_bookings = serializers.BooleanField(required=False)
    notify_messages = serializers.BooleanField(required=False)
    notify_reviews = serializers.BooleanField(required=False)
    notify_comments = serializers.BooleanField(required=False)
    notify_connections = serializers.BooleanField(required=False)
    show_about = serializers.BooleanField(required=False)
    show_pets = serializers.BooleanField(required=False)
    show_looking_for = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = (
            'username', 'name', 'description', 'country', 'city', 'experience', 'price', 
            'sitter_pet_types', 'looking_for', 'notify_bookings', 'notify_messages', 
            'notify_reviews', 'notify_comments', 'notify_connections', 'show_about', 
            'show_pets', 'show_looking_for', 'availability_status', 'availability_location', 
            'availability_capacity', 'available_times'
        )

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar',)

    def validate_avatar(self, value):
        max_size = 5 * 1024 * 1024  # 5MB
        if value.size > max_size:
            raise serializers.ValidationError("Image file size cannot exceed 5MB.")
        return value

class BannerUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('banner',)

class UserOnlineStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'online_status', 'last_seen')
        read_only_fields = fields

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        min_req = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$'
        if not re.match(min_req, value):
            raise serializers.ValidationError("Password must contain at least 8 chars, one lower, one upper, one number, and one special char.")
        return value
