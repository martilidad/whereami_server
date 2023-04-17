from django.conf import settings
from django.test import TestCase
import pytest
from whereami.models import Game
print("test file is imported")


@pytest.mark.django_db
class GameTestCase(TestCase):

    def setup_method(self, method):
        Game.objects.create(name="testgame")

    def test_get_games(self):
        print("database engine is:")
        print(settings.DATABASES['default']['ENGINE'])
        self.assertEqual(len(Game.objects.all()), 1)