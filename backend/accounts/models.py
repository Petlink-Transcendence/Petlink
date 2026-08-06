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
    pet_types = models.JSONField(default=list, blank=True)  # For owners
    sitter_pet_types = models.JSONField(default=list, blank=True)  # For sitters
    looking_for = models.JSONField(default=list, blank=True)  # For owners
    availability_status = models.CharField(
        max_length=20,
        choices=[
            ('Accepting', 'Accepting'),
            ('Not available', 'Not available'),
        ],
        default='Not available',
    )
    availability_location = models.CharField(max_length=255, null=True, blank=True)
    availability_capacity = models.CharField(max_length=100, null=True, blank=True)
    available_times = models.JSONField(default=list, blank=True)

    # Status && Realtime
    online_status = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)

    # Notification preferences
    notify_bookings = models.BooleanField(default=True)
    notify_messages = models.BooleanField(default=True)
    notify_reviews = models.BooleanField(default=True)
    notify_comments = models.BooleanField(default=True)
    notify_connections = models.BooleanField(default=True)

    #Privacy settings
    show_about = models.BooleanField(default=True)
    show_pets = models.BooleanField(default=True)
    show_looking_for = models.BooleanField(default=True)

    # OAuth (42 Intranet)
    oauth_provider = models.CharField(max_length=50, null=True, blank=True)
    oauth_id = models.CharField(max_length=255, null=True, blank=True)

    # Soft Delete
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Managers configuration
    objects = ActiveUserManager() # Default: ignore deleteds
    all_objects = UserManager()   # Extra: admins can see deleteds if needed

    def _cleanup_notifications(self):
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM notifications_notification WHERE user_id = %s", [self.id])
                cursor.execute("DELETE FROM notifications_notification WHERE actor_id = %s", [self.id])
                cursor.execute("DELETE FROM notifications_notification WHERE reference_type = 'user' AND reference_id = %s", [self.id])
                cursor.execute("DELETE FROM notifications_notification WHERE reference_type = 'post' AND reference_id IN (SELECT id FROM posts_post WHERE user_id = %s)", [self.id])
        except Exception:
            pass
        try:
            import requests
            requests.delete(f'http://realtime-service:8001/internal/notifications/user/{self.id}/', timeout=2)
        except Exception:
            pass

    def soft_delete(self):
        """Deactivates the user account logically without removing it from the database"""
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save()
        self._cleanup_notifications()

    def delete(self, *args, **kwargs):
        """Hard delete the user and completely erase their uploaded files from storage"""
        self._cleanup_notifications()
        if self.avatar:
            self.avatar.delete(save=False)
        if self.banner:
            self.banner.delete(save=False)
        super().delete(*args, **kwargs)

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
