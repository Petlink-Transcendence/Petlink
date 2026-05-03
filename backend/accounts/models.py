# backend/accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model for the application.
    It inherits from AbstractUser to gain all default auth fields.
    """


    def __str__(self):
        return self.username
