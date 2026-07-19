from django.db import models

class Post(models.Model):
    PURPOSE_CHOICES = [
        ('showcase', 'Showcase'),
        ('adoption', 'Adoption'),
        ('lost', 'Lost'),
        ('found', 'Found'),
        ('service_promo', 'Service Promo'),
    ]

    PET_SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
        ('extra_large', 'Extra Large'),
    ]

    user_id = models.IntegerField()
    purpose = models.CharField(max_length=50, choices=PURPOSE_CHOICES)
    pet_type = models.CharField(max_length=50, null=True, blank=True)
    pet_size = models.CharField(max_length=20, choices=PET_SIZE_CHOICES, null=True, blank=True)
    tags = models.JSONField(null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

class Like(models.Model):
    user_id = models.IntegerField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_id', 'post')