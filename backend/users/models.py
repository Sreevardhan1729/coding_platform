# users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from bson import ObjectId

class CustomUser(AbstractUser):
    _id = models.CharField(primary_key=True, max_length=24, editable=False, default=lambda: str(ObjectId()))
    
    email = models.EmailField(unique=True)
    
    @property
    def id(self):
        return self._id
