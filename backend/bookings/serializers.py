from rest_framework import serializers
from .models import Service, Availability, Booking, Review

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'user', 'type', 'description', 'price', 'currency', 'price_unit', 'duration_minutes', 'is_active', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ('id', 'user', 'start_date', 'end_date', 'time_slots', 'price', 'currency', 'notes', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

class BookingSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.name', read_only=True)
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    pet_type = serializers.CharField(source='pet.type', read_only=True)
    service_type = serializers.CharField(source='service.type', read_only=True)
    service_price = serializers.DecimalField(source='service.price', max_digits=10, decimal_places=2, read_only=True)
    service_currency = serializers.CharField(source='service.currency', read_only=True)
    requester_avatar = serializers.ImageField(source='requester.avatar', read_only=True)
    provider_avatar = serializers.ImageField(source='provider.avatar', read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id', 'requester', 'requester_name', 'requester_avatar', 'provider', 'provider_name', 'provider_avatar',
            'service', 'service_type', 'service_price', 'service_currency',
            'pet', 'pet_name', 'pet_type',
            'status', 'date', 'start_time', 'end_time', 'location',
            'message', 'price_at_booking', 'currency', 'created_at'
        )
        read_only_fields = ('id', 'requester', 'status', 'price_at_booking', 'created_at')

class ReviewSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=1000, required=False, allow_blank=True, allow_null=True)
    reviewer_name = serializers.CharField(source='reviewer.name', read_only=True)
    reviewer_username = serializers.CharField(source='reviewer.username', read_only=True)
    reviewer_user_type = serializers.CharField(source='reviewer.user_type', read_only=True)
    reviewer_avatar = serializers.ImageField(source='reviewer.avatar', read_only=True)
    reviewee_name = serializers.CharField(source='reviewee.name', read_only=True)
    reviewee_username = serializers.CharField(source='reviewee.username', read_only=True)

    class Meta:
        model = Review
        fields = (
            'id', 'reviewer', 'reviewer_name', 'reviewer_username', 'reviewer_user_type', 'reviewer_avatar',
            'reviewee', 'reviewee_name', 'reviewee_username',
            'booking', 'rating', 'comment', 'created_at'
        )
        read_only_fields = (
            'id', 'reviewer', 'reviewer_name', 'reviewer_username', 'reviewer_user_type', 'reviewer_avatar',
            'reviewee', 'reviewee_name', 'reviewee_username', 'created_at'
        )
