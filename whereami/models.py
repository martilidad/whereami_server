from datetime import datetime

from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Challenge(models.Model):
    name = models.CharField(max_length=32, unique=True)
    pub_date = models.DateTimeField(default=datetime.now, blank=True)


class Location(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    name = models.CharField(max_length=32, unique=True)
    lat = models.FloatField()
    long = models.FloatField()
    pub_date = models.DateTimeField(default=datetime.now, blank=True)


class Guess(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    lat = models.FloatField()
    long = models.FloatField()
    score = models.IntegerField()
    distance = models.IntegerField()
    pub_date = models.DateTimeField(default=datetime.now, blank=True)
