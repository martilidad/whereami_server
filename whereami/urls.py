from django.conf.urls import url
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from . import views

router = DefaultRouter()
router.register(r'challenges', views.ChallengeViewSet, basename="challenges")
router.register(r'games', views.GameViewSet, basename="games")

urlpatterns = [
    # path('challenges', views.challenges, name='challenges'),
    # TODO, remove CRUD controllers
    path('redirect/invite', views.invite, name='invite'),
    path('api/guess', views.guess, name='guess'),
    path('api/challengeOverview', views.challenge_overview, name='challengeOverview'),
    path('api/challenge', views.challenge, name='challenge'),
    path('api/game', views.game, name='game'),
    path('api/scores', views.scores, name='scores'),
    path(r'api/token-auth/', obtain_jwt_token),
    path(r'api/token-refresh/', refresh_jwt_token),
    path(r'api/google-api-key/', views.google_api_key, name='google-api-key'),
    path('api/', include(router.urls))
]
