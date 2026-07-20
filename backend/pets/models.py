from django.db import models
from django.conf import settings

class Pet(models.Model):
    # Allowed pet types — only these values can be stored in the type field
    class PetType(models.TextChoices):
        DOG = 'dog', 'Dog'
        CAT = 'cat', 'Cat'
        BIRD = 'bird', 'Bird'
        RABBIT = 'rabbit', 'Rabbit'
        OTHER = 'other', 'Other'
    
    # Required fields
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=PetType.choices)

    # Optional fields
    breed = models.CharField(max_length=100, null=True, blank=True)
    avatar = models.URLField(max_length=500, null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.type})"

class UserPet(models.Model):
    # Links to User and Pet — composite unique key prevents duplicate pairs
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'pet')

    def __str__(self):
        return f"{self.user.username} -> {self.pet.name}"