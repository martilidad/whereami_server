import json

from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.http import HttpResponse, Http404, HttpResponseBadRequest
from django.http import JsonResponse
from django.shortcuts import render

from whereami.models import ChallengeLocation, Guess, Challenge


# Create your views here.


@login_required
def index(request):
    challenges = Challenge.objects.annotate(Count('challengelocation'))
    context = {'challenges': challenges}
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
    if request.method != 'GET':
        raise Http404()
    try:
        id = request.GET['Challenge_Location_ID']
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
