import json

from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse, Http404, HttpResponseBadRequest
from django.http import JsonResponse

from whereami.models import Location, Guess, Challenge


# Create your views here.


@login_required
def index(request):
    return HttpResponseRedirect("static/index.html")


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
        location_id = data['Location_ID']
        location = Location.objects.get(pk=location_id)
        lat = data['Lat']
        long = data['Long']
        # Let's just believe the client for now
        score = data['Score']
        distance = data['Distance']
        guess = Guess(user=user, location=location, lat=lat, long=long, score=score, distance=distance)
        guess.save()
        return HttpResponse()
    except (KeyError, Location.DoesNotExist):
        return HttpResponseBadRequest()


def get_guesses(request):
    try:
        location_id = request.GET['Location_ID']
        location = Location.objects.get(id=location_id)
        guesses = location.guess_set.all()
        response_dict = {}
        for guess in guesses:
            response_dict[guess.user.username] = \
                {'Lat': guess.lat, 'Long': guess.long, 'Score': guess.score, 'Distance': guess.distance}
        return JsonResponse(response_dict, safe=False)
    except (KeyError, Location.DoesNotExist):
        return HttpResponseBadRequest()


@login_required
def challenge(request):
    if request.method != 'GET':
        raise Http404()
    try:
        id = request.GET['Challenge_ID']
        obj = Challenge.objects.get(id=id)
        locations = obj.location_set.all()
        response_dict = []
        for location in locations:
            response_dict.append({'Location_ID': location.id, 'Lat': location.lat, 'Long': location.long})
        return JsonResponse(response_dict, safe=False)
    except (KeyError, Challenge.DoesNotExist):
        return HttpResponseBadRequest()

