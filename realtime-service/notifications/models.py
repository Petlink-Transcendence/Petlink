from django.db import models

class Notification(models.Model):
    TYPE_CHOICES = [
            ('new_connection', 'New Connection'),
            ('new_message', 'New Message'),
            ('booking_request', 'Booking Request'),
            ('booking_confirmed', 'Booking Confirmed'),
            ('booking_cancelled', 'Booking Cancelled'),
            ('booking_completed', 'Booking Completed'),
            ('new_review', 'New Review'),
            ('new_comment', 'New Comment'),
            ('new_like', 'New Like'),
    ]

    user_id = models.IntegerField()
    actor_id = models.IntegerField(null=True, blank=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    content = models.CharField(max_length=500)
    reference_id = models.IntegerField(null=True, blank=True)
    reference_type = models.CharField(max_length=50, null=True, blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
