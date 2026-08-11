from django.db import models

class Message(models.Model):
    sender_id = models.IntegerField()
    recipient_id = models.IntegerField()
    content = models.TextField()
    is_deleted = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
