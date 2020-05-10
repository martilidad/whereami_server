import json
import random

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction, IntegrityError
from django.db.models import Count, Sum, Q, Max
from django.http import HttpResponse, Http404, HttpResponseBadRequest, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render

from whereami.models import ChallengeLocation, Guess, Challenge, Game, Location


# Create your views here.


@login_required
def index(request):
    challenges = Challenge.objects.annotate(Count('challengelocation'))
    games = Game.objects.annotate(Count('locations'))
    context = {'challenges': challenges, 'games': games}
    return render(request, "index.html", context)


@login_required
def start_challenge(request):
    context = {'google_api_key': settings.GOOGLE_API_KEY}
    return render(request, "startChallenge.html", context)


@login_required
def guess(request):
    if request.method == 'POST':
        return post_guess(request)
    elif request.method == 'GET':
        return get_guesses(request)
    else:
        raise Http404()


def post_guess(request):
    try:
        user = request.user
        data = json.loads(request.body)
        challenge_location_id = data['Challenge_Location_ID']
        challenge_location = ChallengeLocation.objects.get(pk=challenge_location_id)
        lat = data['Lat']
        long = data['Long']
        # Let's just believe the client for now
        score = data['Score']
        distance = data['Distance']
        guess = Guess(user=user, challenge_location=challenge_location, lat=lat, long=long, score=score,
                      distance=distance)
        guess.save()
        return HttpResponse()
    except (KeyError, ChallengeLocation.DoesNotExist, IntegrityError):
        return HttpResponseBadRequest()


def get_guesses(request):
    try:
        challenge_location_id = request.GET['Challenge_Location_ID']
        challenge_location = ChallengeLocation.objects.get(id=challenge_location_id)
        guesses = challenge_location.guess_set.all()
        response_dict = [{'Name': guess.user.username, 'Lat': guess.lat, 'Long': guess.long, 'Score': guess.score,
                          'Distance': guess.distance} for guess in guesses]
        return JsonResponse(response_dict, safe=False)
    except (KeyError, ChallengeLocation.DoesNotExist):
        return HttpResponseBadRequest()


@login_required
def challenge(request):
    if request.method == 'GET':
        return get_challenge(request)
    elif request.method == 'POST':
        return post_challenge(request)
    else:
        raise Http404()


def get_challenge(request):
    try:
        id = request.GET['Challenge_ID']
        obj = Challenge.objects.get(id=id)
        challenge_locations = obj.challengelocation_set.all()
        list = [{'Challenge_Location_ID': challenge_location.id,
                 'Lat': challenge_location.location.lat, 'Long': challenge_location.location.long}
                for challenge_location in challenge_locations]
        response_dict = {'Challenge_ID': id, 'Time': obj.time, 'Challenge_Locations': list}
        return JsonResponse(response_dict, safe=False)
    except (KeyError, Challenge.DoesNotExist):
        return HttpResponseBadRequest()


def post_challenge(request):
    try:
        game_id = request.POST['game']
        game = Game.objects.get(id=game_id)
        quantity = int(request.POST['quantity'])
        prevent_reuse = request.POST.get('preventReuse', default=False)
        time = request.POST['time']
        if prevent_reuse:
            # exclude locations where ChallengeLocations exist already
            used_location_ids = ChallengeLocation.objects.values_list('location_id', flat=True)
            locations = game.locations.exclude(pk__in=used_location_ids)
        else:
            locations = game.locations.all()
        if len(locations) < quantity:
            # TODO proper error
            return HttpResponseBadRequest()
        sampled_locations = random.sample(list(locations), quantity)
        with transaction.atomic():
            challenge = Challenge(game=game, time=time)
            challenge.save()
            ChallengeLocation.objects.bulk_create(
                [ChallengeLocation(challenge=challenge, location=location) for location in sampled_locations])
        return HttpResponseRedirect('/')
    except (KeyError, Game.DoesNotExist) as ke:
        return HttpResponseBadRequest()


def post_game(request):
    try:
        data = json.loads(request.body)
        name = data['Name']
        locations = data['Locations']
        with transaction.atomic():
            game = Game(name=name)
            game.save()
            Location.objects.bulk_create(
                [Location(name=location['Name'], lat=location['Lat'], long=location['Long'], game=game)
                 for location in locations])
        return HttpResponse()
    except KeyError:
        return HttpResponseBadRequest()


@login_required
def game(request):
    if request.method == 'GET':
        return render(request, "creategame.html", context={'google_api_key': settings.GOOGLE_API_KEY})
    if request.method == 'POST':
        return post_game(request)
    else:
        return Http404()


@login_required
def scores(request):
    if request.method != 'GET':
        return Http404()
    challenge_id = request.GET['Challenge_ID']
    users = user_challenge_scores(challenge_id)
    return JsonResponse([{'name': user.username, 'score': user.score, 'distance': user.distance,
                          'completed_locations': user.completed_locations, 'last_interaction': user.last_interaction}
                         for user in users], safe=False)


def user_challenge_scores(challenge_id):
    challenge_filter = Q(guess__challenge_location__challenge_id=challenge_id)
    score = Sum('guess__score', filter=challenge_filter)
    distance = Sum('guess__distance', filter=challenge_filter)
    completed_locations = Count('guess', filter=challenge_filter)
    last_interaction = Max('guess__pub_date', filter=challenge_filter)
    # completed_locations__gte 1 ^= filter for at least guess location
    users = User.objects \
        .annotate(completed_locations=completed_locations).filter(completed_locations__gte=1) \
        .annotate(score=score) \
        .annotate(distance=distance) \
        .annotate(last_interaction=last_interaction)
    return users


@login_required
def challenge_overview(request):
    if request.method != 'GET':
        return Http404()
    challenge_id = request.GET['Challenge_ID']
    challenge = Challenge.objects.get(id=challenge_id)
    challenge_locations = challenge.challengelocation_set.all().prefetch_related('guess_set', 'location')
    users = user_challenge_scores(challenge_id)
    users.order_by('score')
    winner = users.first()
    winner_name = winner.username if winner else None
    # TODO fix script injection possibility (username), currently admin register only though
    context = {'scores': json.dumps([{'name': user.username, 'score': user.score, 'distance': user.distance,
                                      'completed_locations': user.completed_locations,
                                      'last_interaction': user.last_interaction}
                                     for user in users], cls=DjangoJSONEncoder),
               'winner': winner_name,
               'challenge_id': challenge_id,
               'challenge_locations': challenge_locations,
               'google_api_key': settings.GOOGLE_API_KEY
               }
    return render(request, 'challengeOverview.html', context)
