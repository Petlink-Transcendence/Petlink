import re
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

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
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'user_type', 'role', 'avatar', 'banner', 'description', 'city', 'country', 'rating', 'online_status', 'created_at', 'experience', 'price', 'pet_types', 'looking_for')
        read_only_fields = fields

class UserPublicProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'name', 'role', 'avatar', 'banner', 'description',
            'city', 'country', 'user_type', 'rating', 'followers_count', 
            'following_count', 'post_count', 'experience', 'price', 
            'pet_types', 'looking_for', 'created_at'
        )
        read_only_fields = fields

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            public_fields = {'id', 'name', 'role', 'avatar', 'banner'}
        else:
            public_fields = set(fields.keys())
        for field in list(fields.keys()):
            if field not in public_fields:
                fields.pop(field, None)
        return fields

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data.get('avatar'):
            data['avatar'] = '/static/avatars/profile-pic.png'
        return data

    def get_followers_count(self, obj): return obj.followers.count()
    def get_following_count(self, obj): return obj.following.count()
    def get_post_count(self, obj): return obj.posts.count()

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'description', 'country', 'city', 'experience', 'price', 'pet_types', 'looking_for')

class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar',)

class BannerUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('banner',)

class UserOnlineStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'online_status', 'last_seen')
        read_only_fields = fields