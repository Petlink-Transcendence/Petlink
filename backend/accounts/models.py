from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils import timezone

class ActiveUserManager(UserManager):
    """
    Manager customizado para o Soft Delete.
    Sempre que chamarmos User.objects.all(), ele vai ignorar os deletados.
    """
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class User(AbstractUser):
    class UserType(models.TextChoices):
        OWNER = 'owner', 'Owner'
        PROVIDER = 'provider', 'Provider'

    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        MODERATOR = 'moderator', 'Moderator'
        USER = 'user', 'User'
        GUEST = 'guest', 'Guest'

    # Mandatory fields
    name = models.CharField(max_length=100)
    user_type = models.CharField(max_length=10, choices=UserType.choices)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)

    # username, email, password and is_active already exists in AbstractUser

    # Optional fields/ profile
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    banner = models.ImageField(upload_to='banners/', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    experience = models.TextField(null=True, blank=True)  # For sitters
    price = models.TextField(null=True, blank=True)  # For sitters
    pet_types = models.JSONField(default=list, blank=True)  # For sitters
    
    # Status && Realtime
    online_status = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)

    # OAuth (42 Intranet)
    oauth_provider = models.CharField(max_length=50, null=True, blank=True)
    oauth_id = models.CharField(max_length=255, null=True, blank=True)

    # Soft Delete
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Managers configuration
    objects = ActiveUserManager() # Default: ignore deleteds
    all_objects = UserManager()   # Extra: admins can see deleteds if needed

    def soft_delete(self):
        """Deactivates the user account logically without removing it from the database"""
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save()

    def reactivate(self):
        """Restores a logically deleted account"""
        self.deleted_at = None
        self.is_active = True
        self.save()

    def __str__(self):
        return f"{self.username} ({self.user_type})"

class Follower(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')

    class Meta:
        unique_together = ('follower', 'following')