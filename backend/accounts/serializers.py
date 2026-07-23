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
        fields = ('id', 'username', 'email', 'name', 'user_type', 'role', 'avatar', 'banner', 'description', 'city', 'country', 'rating', 'online_status', 'created_at', 'experience', 'price', 'sitter_pet_types', 'looking_for', 'oauth_provider')
        read_only_fields = fields

class UserPublicProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'name', 'role', 'avatar', 'banner', 'description',
            'city', 'country', 'user_type', 'rating', 'followers_count',
            'following_count', 'experience', 'price',
            'looking_for', 'created_at', 'sitter_pet_types'
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

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150, min_length=1, required=False)
    name = serializers.CharField(max_length=100, min_length=1)
    description = serializers.CharField(max_length=500, required=False, allow_blank=True, allow_null=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    experience = serializers.IntegerField(required=False, min_value=0, allow_null=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    sitter_pet_types = serializers.ListField(child=serializers.CharField(max_length=50), required=False, allow_empty=True)
    looking_for = serializers.ListField(child=serializers.CharField(max_length=50), required=False, allow_empty=True)

    class Meta:
        model = User
        fields = ('username', 'name', 'description', 'country', 'city', 'experience', 'price', 'sitter_pet_types', 'looking_for')

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

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

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        min_req = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$'
        if not re.match(min_req, value):
            raise serializers.ValidationError("Password must contain at least 8 chars, one lower, one upper, one number, and one special char.")
        return value