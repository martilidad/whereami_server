#python file for all DTOs
from rest_framework import serializers

from whereami.models import Challenge, Game


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

    class Meta:
        model = Challenge
        fields = [
            'id',
            'pub_date',
            'location_count',
            'time',
            'game'
        ]




