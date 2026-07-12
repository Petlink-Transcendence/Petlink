from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Service, Availability, Booking, Review
from .serializers import ServiceSerializer, AvailabilitySerializer, BookingSerializer, ReviewSerializer

class ServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Service.objects.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class AvailabilityListCreateView(generics.ListCreateAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        if pk:
            return Availability.objects.filter(user_id=pk)
        return Availability.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AvailabilityDeleteView(generics.DestroyAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Availability.objects.filter(user=self.request.user)

class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from django.db import models
        return Booking.objects.filter(
            models.Q(requester=self.request.user) | models.Q(provider=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

class BookingActionView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, action):
        booking = get_object_or_404(Booking, pk=pk)
        if action == 'confirm' and booking.provider == request.user:
            booking.status = 'confirmed'
        elif action == 'cancel' and request.user in [booking.requester, booking.provider]:
            booking.status = 'cancelled'
        elif action == 'complete' and booking.provider == request.user:
            booking.status = 'completed'
        else:
            return Response(status=403)
        booking.save()
        return Response(BookingSerializer(booking).data)

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(reviewee_id=self.kwargs['pk'], deleted_at__isnull=True)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
