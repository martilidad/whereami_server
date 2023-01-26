# chat/routing.py
from django.urls import re_path

from whereami import consumers

websocket_urlpatterns = [
    re_path(r'ws/challenge/(?P<challenge_id>\w+)/$', consumers.ChallengeStatusConsumer.as_asgi()),
]