import json

from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse, Http404, HttpResponseBadRequest
from django.http import JsonResponse

from whereami.models import Location, Guess


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
    body = request.body
    return JsonResponse({'A': {'LLArr': [31.710572, -81.731586]}, 'B': {'LLArr': [54.730097, -113.322859]}},
                            safe=False)
