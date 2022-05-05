from django.conf.urls import url
from django.urls import path
from django.views.generic import TemplateView, RedirectView

from . import views

urlpatterns = [
    path('challenges', views.challenges, name='challenges'),
    path('games', views.games, name='games'),
    path('startChallenge', views.start_challenge, name='startChallenge'),
    path('guess', views.guess, name='guess'),
    path('challengeOverview', views.challenge_overview, name='challengeOverview'),
    path('challenge', views.challenge, name='challenge'),
    path('game', views.game, name='game'),
    path('scores', views.scores, name='scores'),
    path('invite', views.invite, name='invite'),
    url(r'.*', RedirectView.as_view(url='/static/ng/index.html'))
]
