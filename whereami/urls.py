from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('guess', views.guess, name='guess'),
    path('challenge', views.challenge, name='challenge'),
    path('game', views.game, name='game'),
]
