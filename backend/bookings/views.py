from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
import requests as http_requests
from .models import Service, Availability, Booking, Review
from .serializers import ServiceSerializer, AvailabilitySerializer, BookingSerializer, ReviewSerializer

REALTIME_NOTIFY_URL = 'http://realtime-service:8001/internal/notify/'

def _notify(user_id, notif_type, content, reference_id=None, reference_type=None):
    try:
        http_requests.post(REALTIME_NOTIFY_URL, json={
            'user_id': user_id,
            'type': notif_type,
            'content': content,
            'reference_id': reference_id,
            'reference_type': reference_type,
        }, timeout=2)
    except Exception:
        pass

class ServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Service.objects.filter(is_active=True)

    def perform_create(self, serializer):
        if self.request.user.user_type != 'provider':
            raise PermissionDenied("Only providers can create services.")
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
        if self.request.user.user_type != 'provider':
            raise PermissionDenied("Only providers can create availability.")
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
        booking = serializer.save(requester=self.request.user)
        # Notify the provider about the new booking request
        _notify(
            user_id=booking.provider.id,
            notif_type='booking_request',
            content=f'{self.request.user.name or self.request.user.username} sent you a booking request.',
            reference_id=booking.id,
            reference_type='booking',
        )

class BookingActionView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, action):
        booking = get_object_or_404(Booking, pk=pk)
        if action == 'confirm' and booking.provider == request.user:
            booking.status = 'confirmed'
            _notify(
                user_id=booking.requester.id,
                notif_type='booking_confirmed',
                content=f'{request.user.name or request.user.username} confirmed your booking.',
                reference_id=booking.id,
                reference_type='booking',
            )
        elif action == 'cancel' and request.user in [booking.requester, booking.provider]:
            booking.status = 'cancelled'
            # Notify whichever party didn't cancel
            recipient = booking.requester if request.user == booking.provider else booking.provider
            _notify(
                user_id=recipient.id,
                notif_type='booking_cancelled',
                content=f'{request.user.name or request.user.username} cancelled the booking.',
                reference_id=booking.id,
                reference_type='booking',
            )
        elif action == 'complete' and booking.provider == request.user:
            booking.status = 'completed'
            _notify(
                user_id=booking.requester.id,
                notif_type='booking_completed',
                content=f'{request.user.name or request.user.username} marked the booking as completed.',
                reference_id=booking.id,
                reference_type='booking',
            )
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
        review = serializer.save(reviewer=self.request.user, reviewee_id=self.kwargs['pk'])
        # Notify the person being reviewed
        _notify(
            user_id=review.reviewee.id,
            notif_type='new_review',
            content=f'{self.request.user.name or self.request.user.username} left you a {review.rating}-star review.',
            reference_id=review.id,
            reference_type='review',
        )
