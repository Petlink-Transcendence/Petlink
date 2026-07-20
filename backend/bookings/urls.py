from django.urls import path
from .views import (
    ServiceListCreateView, ServiceDetailView,
    AvailabilityListCreateView, AvailabilityDeleteView,
    BookingListCreateView, BookingActionView,
    ReviewListCreateView
)

urlpatterns = [
    path('services/', ServiceListCreateView.as_view(), name='service-list-create'),
    path('services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('availability/', AvailabilityListCreateView.as_view(), name='availability-list-create'),
    path('availability/<int:pk>/', AvailabilityListCreateView.as_view(), name='availability-by-user'),
    path('availability/<int:pk>/delete/', AvailabilityDeleteView.as_view(), name='availability-delete'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/<str:action>/', BookingActionView.as_view(), name='booking-action'),
    path('users/<int:pk>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
]
