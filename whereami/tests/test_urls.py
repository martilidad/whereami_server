import asyncio
import logging

import pytest
from channels.testing import WebsocketCommunicator
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.test import Client, TestCase
from rest_framework.test import APIClient
import whereami
from whereami.auth import JWTAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from whereami_server import asgi

get_urls_without_params = ['/api/games/', 
            '/api/challenges/',
            '/api/google-api-key/']


@pytest.fixture
def authorized_client(valid_token):
    apiClient = APIClient()
    apiClient.credentials(HTTP_AUTHORIZATION='JWT ' + valid_token)
    return apiClient


@pytest.mark.django_db
@pytest.fixture
def valid_token():
    User.objects.all().delete()
    User.objects.create(username='user', password=make_password('changeme'))
    client = Client()
    response = client.post('/api/token-auth/', {'username': 'user', 'password': 'changeme'}, content_type='application/json')
    assert response.status_code == 200
    return response.data['token']


@pytest.mark.skip("something broke when switching to pytest :(")
@pytest.mark.django_db
@pytest.mark.asyncio
async def test_web_socket(valid_token):
    communicator = WebsocketCommunicator(JWTAuthMiddlewareStack(URLRouter(whereami.routing.websocket_urlpatterns)), "/ws/challenge/1/?token=" + valid_token)
    connected, subprotocol = await communicator.connect(timeout=10)
    assert connected
    response = await communicator.receive_json_from(timeout=5)
    assert {'type': 'resync'} <= response
    await communicator.send_json_to({'user_data': {'status': 'invite_screen', 'round': -1}, 'sync_time': 3})
    response = await communicator.receive_json_from()
    assert {'type': 'client_update', 'username': 'user', 
                                    'user_data': {'status': 'invite_screen', 'round': -1}} <= response
    # Close
    await communicator.disconnect()


@pytest.mark.asyncio
@pytest.mark.django_db
async def test_web_socket_invalid_token():
    communicator = WebsocketCommunicator(asgi.application, "/ws/challenge/1/?token=invalid")
    with pytest.raises(asyncio.TimeoutError):
        await communicator.connect(timeout=0.1)


@pytest.mark.django_db
@pytest.mark.parametrize("url", get_urls_without_params)
def test_get_urls(authorized_client, url):
    response = authorized_client.get(url)
    assert response.status_code == 200

@pytest.mark.django_db
def test_post_games(authorized_client: APIClient):
    response = authorized_client.post("/api/games/", {"name": "test", "locations": []}, format='json')
    assert response.status_code == 201
