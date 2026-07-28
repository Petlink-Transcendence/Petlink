from django.contrib import admin
from .models import Service, Availability, Booking, Review


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'price', 'currency', 'price_unit', 'is_active')
    list_filter = ('type', 'is_active', 'currency')
    search_fields = ('user__username',)


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_date', 'end_date', 'price', 'currency')
    search_fields = ('user__username',)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('requester', 'provider', 'service', 'pet', 'status', 'date')
    list_filter = ('status',)
    search_fields = ('requester__username', 'provider__username')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'reviewee', 'rating', 'created_at', 'deleted_at')
    list_filter = ('rating',)
    search_fields = ('reviewer__username', 'reviewee__username')
