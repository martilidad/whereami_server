from datetime import datetime

from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Game(models.Model):
    name = models.CharField(max_length=32, unique=True)


class Challenge(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    time = models.IntegerField()
    pub_date = models.DateTimeField(default=datetime.now, blank=True)


class Location(models.Model):
    name = models.CharField(max_length=32, unique=True)
    lat = models.FloatField()
    long = models.FloatField()
    pub_date = models.DateTimeField(default=datetime.now, blank=True)


class ChallengeLocation(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)


class Guess(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge_location = models.ForeignKey(ChallengeLocation, on_delete=models.CASCADE)
    lat = models.FloatField()
    long = models.FloatField()
    score = models.IntegerField()
    distance = models.IntegerField()
    pub_date = models.DateTimeField(default=datetime.now, blank=True)

    class Meta:
        unique_together = ('user', 'challenge_location')
