#python file for all DTOs
from rest_framework import serializers

from whereami.models import Challenge, Game, ChallengeLocation, Guess

class ChallengeLocationSerializer(serializers.HyperlinkedModelSerializer):
    guessed = serializers.BooleanField()
    class Meta:
        model = ChallengeLocation
        fields = [
            'id',
            'guessed'
        ]


class GameSerializer(serializers.HyperlinkedModelSerializer):
    location_count = serializers.IntegerField()

    class Meta:
        model = Game
        fields = [
            'id',
            'name',
            'location_count'
        ]


class ChallengeSerializer(serializers.HyperlinkedModelSerializer):
    location_count = serializers.IntegerField()
    game = GameSerializer()
    challengelocation_set = ChallengeLocationSerializer(many=True)

    class Meta:
        model = Challenge
        fields = [
            'id',
            'pub_date',
            'location_count',
            'time',
            'game',
            'challengelocation_set'
        ]




