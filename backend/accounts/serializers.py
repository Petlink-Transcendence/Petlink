import re
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer to validate and create a new user"""
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
        """Validates user password minimum requirements"""
        min_req = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$'

        if not re.match(min_req, value):
            raise serializers.ValidationError(
                "The password must contain at least 8 characters, one lowercase, one uppercase, one number and one special character."
            )
        return value

    def create(self, validated_data):
        """Create a new user with encrypted password and mandatory fields"""
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            user_type=validated_data['user_type']
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer to return user profile data (safe fields only)"""
    class Meta:
        model = User
        # Excludes sensitive data like password_hash, oauth_id, etc.
        fields = (
            'id', 'username', 'email', 'name', 'user_type', 'role',
            'avatar', 'banner', 'description', 'rating', 'online_status'
        )
        # Ensures no one can accidentally modify data using a GET view
        read_only_fields = fields

class UserPublicProfileSerializer(serializers.ModelSerializer):
    """Public User Serializer"""

    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'name', 'avatar', 'banner', 'description',
            'city', 'user_type', 'rating', 'followers_count', 'following_count'
        )
        read_only_fields = fields

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data['avatar']:
            data['avatar'] = '/static/avatars/profile-pic.png'
        return data
    
    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """update profile serializer"""
    class Meta:
        model = User
        fields = (
            'name', 'description', 'country', 'city'
        )

class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar' ,)

class BannerUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('banner' ,)

class UserOnlineStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'online_status', 'last_seen')
        read_only_fields = fields
