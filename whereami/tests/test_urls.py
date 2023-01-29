from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient


get_urls_without_params = ['/api/games/', 
            '/api/challenges/',
            '/api/google-api-key/']

class UrlsTestCase(TestCase):

    def setUp(self):
        User.objects.create(username='user', password=make_password('changeme'))
        client = Client()
        response = client.post('/api/token-auth/', {'username': 'user', 'password': 'changeme'}, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        token = response.data['token']        
        self.apiClient = APIClient()
        self.apiClient.credentials(HTTP_AUTHORIZATION='JWT ' + token)

    def test_get_urls(self):
        # TODO use some fancy test framework for parameterized tests
        for url in get_urls_without_params:
          print(url)
          response = self.apiClient.get(url)
          self.assertEqual(response.status_code, 200)