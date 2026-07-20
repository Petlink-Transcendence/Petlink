from django.db import models
from django.contrib.auth import get_user_model
from pets.models import Pet

User = get_user_model()

class Service(models.Model):
    class ServiceType(models.TextChoices):
        DOG_WALKING = 'dog_walking', 'Dog Walking'
        CAT_SITTING = 'cat_sitting', 'Cat Sitting'
        HOME_VISITS = 'home_visits', 'Home Visits'
        OVERNIGHT_STAY = 'overnight_stay', 'Overnight Stay'
        GROOMING = 'grooming', 'Grooming'        

    class PriceUnit(models.TextChoices):
        PER_HOUR = 'per_hour', 'Per Hour'
        PER_DAY = 'per_day', 'Per Day'
        PER_SESSION = 'per_session', 'Per Session'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    type = models.CharField(max_length=20, choices=ServiceType.choices)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    currency = models.CharField(max_length=10, default='EUR')
    price_unit = models.CharField(max_length=20, choices=PriceUnit.choices)
    duration_minutes = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Availability(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='availability')
    start_date = models.DateField()
    end_date = models.DateField()
    time_slots = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='EUR')
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings_made')
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings_received')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=255, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    price_at_booking = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='EUR')
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_received')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.SmallIntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)