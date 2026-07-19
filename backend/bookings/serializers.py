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
    class Meta:
        model = Review
        fields = ('id', 'reviewer', 'reviewee', 'booking', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'reviewer', 'created_at')
