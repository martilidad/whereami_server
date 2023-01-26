#python file for all DTOs
from rest_framework import serializers

from whereami.models import Challenge, Game, ChallengeLocation, Guess, Location

class LocationSerializer(serializers.HyperlinkedModelSerializer):
    Lat = serializers.FloatField(source='lat')
    Long = serializers.FloatField(source='long')
    class Meta:
        model = Location
        fields = [
            'id',
            'Lat',
            'Long'
        ]

class ChallengeLocationSerializer(serializers.HyperlinkedModelSerializer):
    guessed = serializers.BooleanField()
    class Meta:
        model = ChallengeLocation
        fields = [
            'id',
            'guessed'
        ]


class GameSerializer(serializers.HyperlinkedModelSerializer):
    locations = LocationSerializer(many=True)
    location_count = serializers.IntegerField()

    class Meta:
        model = Game
        fields = [
            'id',
            'name',
            # kept only for compatability; remove ASAP
            'location_count',
            'locations'
        ]


class ChallengeSerializer(serializers.HyperlinkedModelSerializer):
    location_count = serializers.IntegerField()
    game = GameSerializer()
    challengelocation_set = ChallengeLocationSerializer(many=True)
    Time = serializers.IntegerField(source='time')

    class Meta:
        model = Challenge
        fields = [
            'id',
            'pub_date',
            'location_count',
            'Time',
            'game',
            'challengelocation_set'
        ]




