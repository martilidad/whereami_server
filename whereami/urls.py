from django.conf.urls import url
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from . import views

router = routers.SimpleRouter()
router.register(r'challenges', views.ChallengeViewSet, basename="challenges")
router.register(r'games', views.GameViewSet, basename="games")
router.register(r'challengelocations', views.ChallengeLocationViewSet, basename="challengelocations")

guesses_router = routers.NestedSimpleRouter(router, r'challengelocations', lookup='challengelocation')
guesses_router.register(r'guesses', views.GuessViewSet, basename='challengelocation-guesses')

urlpatterns = [
    # path('challenges', views.challenges, name='challenges'),
    # TODO, remove CRUD controllers
    path('redirect/invite', views.invite, name='invite'),
    path(r'api/token-auth/', obtain_jwt_token),
    path(r'api/token-refresh/', refresh_jwt_token),
    path(r'api/google-api-key/', views.google_api_key, name='google-api-key'),
    path('api/', include(router.urls)),
    path('api/', include(guesses_router.urls))
]
