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
    path('', include(router.urls)),
    path('startChallenge', views.start_challenge, name='startChallenge'),
    path('guess', views.guess, name='guess'),
    path('challengeOverview', views.challenge_overview, name='challengeOverview'),
    path('challenge', views.challenge, name='challenge'),
    path('game', views.game, name='game'),
    path('scores', views.scores, name='scores'),
    path('invite', views.invite, name='invite'),
    path('invite', views.invite, name='invite'),
    path(r'api-token-auth/', obtain_jwt_token),
    path(r'api-token-refresh/', refresh_jwt_token)
    # url(r'.*', RedirectView.as_view(url='/static/ng/index.html'))
]
