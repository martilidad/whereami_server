#python file for all DTOs
from rest_framework import serializers

from whereami.models import Challenge, Game, ChallengeLocation, Guess, Location
from django.db.models import (Count, Exists, Max, Min, OuterRef, Prefetch, Q,
                              Sum)
from django.db import transaction

from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema_field

class SpectacularModelSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True, allow_null=True)
    class Meta:
        abstract: True

class LocationSerializer(SpectacularModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True, allow_null=True)
    name = serializers.CharField(allow_blank=True)

    class Meta:
        model = Location
        fields = [
            'id',
            'pub_date',
            'name',
            'lat',
            'long'
        ]


class GuessSerializer(SpectacularModelSerializer):
    username = serializers.SlugRelatedField(source='user', slug_field='username', read_only=True)
    pub_date = serializers.DateTimeField(read_only=True, allow_null=True)

    class Meta:
        model = Guess
        fields = [
            'id',
            'username',
            'lat',
            'long',
            'score',
            'distance',
            'pub_date'
        ]
        read_only_fields = ['id', 'pub_date']


class ChallengeLocationSerializer(SpectacularModelSerializer):
    guessed = serializers.BooleanField(read_only=True)
    guesses = GuessSerializer(many=True, read_only=True)
    lat = serializers.SlugRelatedField(source='location', slug_field='lat', queryset=Location.objects.all())
    long = serializers.SlugRelatedField(source='location', slug_field='long', queryset=Location.objects.all())
    name = serializers.SlugRelatedField(source='location', slug_field='name', queryset=Location.objects.all())

    class Meta:
        model = ChallengeLocation
        fields = [
            'id',
            'guesses',
            'guessed',
            'lat',
            'long',
            'name'
        ]
        read_only_fields = ['id', 'guessed', 'guesses']


class GameSerializer(SpectacularModelSerializer):
    locations = LocationSerializer(many=True)

    class Meta:
        model = Game
        fields = [
            'id',
            'name',
            'locations'
        ]

    @transaction.atomic
    def create(self, validated_data):
        locations_data = validated_data.pop('locations')
        game = Game.objects.create(**validated_data)
        locations = []
        for location_data in locations_data:
            location_serializer = LocationSerializer(data=location_data)
            location_serializer.is_valid(raise_exception=True)
            location = location_serializer.save()
            locations.append(location)
        game.locations.set(locations)
        return game


class ChallengeGenerationSerializer(serializers.Serializer):
  quantity = serializers.IntegerField()
  prevent_reuse = serializers.BooleanField(default=False)
  time = serializers.IntegerField()

class ChallengeScoreSerializer(serializers.Serializer):
  username = serializers.CharField()
  score = serializers.IntegerField()
  distance = serializers.IntegerField()
  completed_locations = serializers.IntegerField()
  last_interaction = serializers.DateTimeField()

class ChallengeSerializer(SpectacularModelSerializer):
    pub_date = serializers.DateTimeField(read_only=True, allow_null=True)
    game = GameSerializer()
    locations = ChallengeLocationSerializer(many=True)
    scores = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Challenge
        fields = [
            'id',
            'pub_date',
            'game',
            'time',
            'locations',
            'scores'
        ]
        read_only_fields = ['id', 'pub_date', 'scores']


    #TODO this causes an extra query for every score calculation (max 5 atm); should be added to viewset query
    @extend_schema_field(ChallengeScoreSerializer(many=True))
    def get_scores(self, obj):
        challenge_filter = Q(guess__challenge_location__challenge=obj)
        score = Sum('guess__score', filter=challenge_filter)
        distance = Sum('guess__distance', filter=challenge_filter)
        completed_locations = Count('guess', filter=challenge_filter)
        last_interaction = Max('guess__pub_date', filter=challenge_filter)
        # completed_locations__gte 1 ^= filter for at least guess location
        users = User.objects \
            .annotate(completed_locations=completed_locations).filter(completed_locations__gte=1) \
            .annotate(score=score) \
            .annotate(distance=distance) \
            .annotate(last_interaction=last_interaction)
        return ChallengeScoreSerializer(users, many=True).data
    







