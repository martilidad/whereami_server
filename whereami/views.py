import json
import random

from django.contrib.auth.decorators import login_required
from django.db.models import Count
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
    except (KeyError, ChallengeLocation.DoesNotExist):
        return HttpResponseBadRequest()


def get_guesses(request):
    try:
        challenge_location_id = request.GET['Challenge_Location_ID']
        challenge_location = ChallengeLocation.objects.get(id=challenge_location_id)
        guesses = challenge_location.guess_set.all()
        response_dict = []
        for guess in guesses:
            response_dict.append(
                {'Name': guess.user.username, 'Lat': guess.lat, 'Long': guess.long, 'Score': guess.score,
                 'Distance': guess.distance})
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
        list = []
        for challenge_location in challenge_locations:
            list.append({'Challenge_Location_ID': challenge_location.id,
                         'Lat': challenge_location.location.lat, 'Long': challenge_location.location.long})
        response_dict = {'Challenge_ID': id, 'Time': obj.time, 'Challenge_Locations': list}
        return JsonResponse(response_dict, safe=False)
    except (KeyError, Challenge.DoesNotExist):
        return HttpResponseBadRequest()


def post_challenge(request):
    try:
        game_id = request.POST['game']
        game = Game.objects.get(id=game_id)
        quantity = int(request.POST['quantity'])
        prevent_reuse = request.POST['preventReuse']
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
        challenge = Challenge(game=game, time=time)
        challenge.save()
        for location in sampled_locations:
            ChallengeLocation(challenge=challenge, location=location).save()
        return HttpResponseRedirect('')
    except (KeyError, Game.DoesNotExist):
        return HttpResponseBadRequest()
