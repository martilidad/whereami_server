from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('startChallenge', views.start_challenge, name='startChallenge'),
    path('guess', views.guess, name='guess'),
    path('challengeOverview', views.challenge_overview, name='challengeOverview'),
    path('challenge', views.challenge, name='challenge'),
    path('game', views.game, name='game'),
    path('scores', views.scores, name='scores'),
]
