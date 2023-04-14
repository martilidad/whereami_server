import itertools
import json
import random

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import IntegrityError, transaction
from django.db.models import (Count, Exists, Max, Min, OuterRef, Prefetch, Q,
                              Sum)
from django.http import (Http404, HttpResponse, HttpResponseBadRequest,
                         HttpResponseRedirect, JsonResponse)
from django.shortcuts import get_object_or_404, render
from django.utils.safestring import mark_safe
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes
from drf_spectacular.utils import extend_schema, extend_schema_view
from psycopg2.errors import UniqueViolation
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from whereami.models import Challenge, ChallengeLocation, Game, Guess, Location
from whereami.serializers import (ChallengeGenerationSerializer,
                                  ChallengeLocationSerializer,
                                  ChallengeSerializer, ErrorCodes,
                                  ErrorSerializer, GameSerializer,
                                  GuessSerializer)


class CreateOrRetrieveViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    pass

class ChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Challenge.objects \
            .order_by('-id') \
            .prefetch_related(Prefetch('game', Game.objects.annotate(location_count=Count('locations'))
                .prefetch_related(Prefetch('locations', Location.objects.all())))) \
            .prefetch_related(Prefetch('challengelocation_set', 
                to_attr='locations', 
                queryset=ChallengeLocation.objects
                .prefetch_related(Prefetch('guess_set', Guess.objects.all(), to_attr='guesses'))
                .annotate(
                    guessed=Exists(Guess.objects.filter(user=self.request.user, challenge_location=OuterRef('pk'))))
                    .prefetch_related(Prefetch('location', Location.objects.all()))))


class ChallengeLocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChallengeLocation.objects.all()
    serializer_class = ChallengeLocationSerializer
    permission_classes = [permissions.IsAuthenticated]


# This router is nested in ChallengeLocationViewset!!
# challengelocation_pk has to be present in kwargs, is validated in the parent
challenge_location_param = OpenApiParameter(
    name='challengelocation_pk',
    type=OpenApiTypes.INT,
    location=OpenApiParameter.PATH,
    description='ID of the Challenge Location resource',
    required=True
)
@extend_schema_view(
    list=extend_schema(parameters=[challenge_location_param]),
    create=extend_schema(parameters=[challenge_location_param]),
    retrieve=extend_schema(parameters=[challenge_location_param]))
class GuessViewSet(CreateOrRetrieveViewSet):
    queryset = Guess.objects.all()
    serializer_class = GuessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Guess.objects.filter(challenge_location_id=self.kwargs['challengelocation_pk'])
    
    @extend_schema(
        responses={200: GuessSerializer, 400:ErrorSerializer}
    )
    def create(self, request, *args, **kwargs):
        challenge_location_id = self.kwargs['challengelocation_pk']
        if Guess.objects.filter(challenge_location_id=challenge_location_id, user=self.request.user).exists():
            return Response(ErrorCodes.EXISTS.create("Location already guessed."), status=status.HTTP_400_BAD_REQUEST)
        serializer = GuessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(challenge_location_id=challenge_location_id, user=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class GameViewSet(CreateOrRetrieveViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Game.objects.annotate(location_count=Count('locations'))


    @extend_schema(responses=ChallengeSerializer, request=ChallengeGenerationSerializer)
    @action(methods=['POST'], detail=True)
    def generate_challenge(self, request, pk=None):
        game = Game.objects.get(id=pk)
        serializer = ChallengeGenerationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quantity = serializer.validated_data.get('quantity')
        prevent_reuse = serializer.validated_data.get('prevent_reuse')
        time = serializer.validated_data.get('time')
        if prevent_reuse:
            # exclude locations where ChallengeLocations exist already
            used_location_ids = ChallengeLocation.objects.values_list('location_id', flat=True)
            locations = game.locations.exclude(pk__in=used_location_ids)
        else:
            locations = game.locations.all()
        if len(locations) < quantity:
            # TODO proper error schema
            return Response("Not enough locations in game.", status=status.HTTP_400_BAD_REQUEST)
        sampled_locations = random.sample(list(locations), quantity)
        with transaction.atomic():
            challenge = Challenge(game=game, time=time)
            challenge.save()
            ChallengeLocation.objects.bulk_create(
                [ChallengeLocation(challenge=challenge, location=location) for location in sampled_locations])
        response_serializer = ChallengeSerializer(challenge)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


# not authenticated! only for open graph response
def invite(request):
    challenge_id = request.GET['Challenge_ID']
    challenge = get_object_or_404(Challenge, id=challenge_id)
    return render(request, 'invite.html', {'full_path': request.get_full_path()[len("/redirect"):],
                                           'challenge': challenge})


@extend_schema(exclude=True)
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def google_api_key(request):
    return JsonResponse({'google_api_key': settings.GOOGLE_API_KEY})
