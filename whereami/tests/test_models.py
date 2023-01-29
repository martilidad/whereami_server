from django.test import TestCase
from whereami.models import Game


class GameTestCase(TestCase):
    def setUp(self):
        Game.objects.create(name="testgame")

    def test_get_games(self):
        self.assertEqual(len(Game.objects.all()), 1)