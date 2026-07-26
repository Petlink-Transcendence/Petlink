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
    class Meta:
        model = Booking
        fields = ('id', 'requester', 'provider', 'service', 'pet', 'status', 'date', 'start_time', 'end_time', 'location', 'message', 'price_at_booking', 'currency', 'created_at')
        read_only_fields = ('id', 'requester', 'status', 'price_at_booking', 'created_at')

class ReviewSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=1000, required=False, allow_blank=True, allow_null=True)
    reviewer_name = serializers.CharField(source='reviewer.name', read_only=True)
    reviewer_username = serializers.CharField(source='reviewer.username', read_only=True)
    reviewer_avatar = serializers.ImageField(source='reviewer.avatar', read_only=True)
    reviewee_name = serializers.CharField(source='reviewee.name', read_only=True)
    reviewee_username = serializers.CharField(source='reviewee.username', read_only=True)

    class Meta:
        model = Review
        fields = (
            'id', 'reviewer', 'reviewer_name', 'reviewer_username', 'reviewer_avatar',
            'reviewee', 'reviewee_name', 'reviewee_username',
            'booking', 'rating', 'comment', 'created_at'
        )
        read_only_fields = (
            'id', 'reviewer', 'reviewer_name', 'reviewer_username', 'reviewer_avatar',
            'reviewee_name', 'reviewee_username', 'created_at'
        )
