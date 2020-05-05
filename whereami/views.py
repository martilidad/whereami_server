import json

from django.http import HttpResponseRedirect, HttpResponse, Http404, HttpResponseBadRequest
from django.http import JsonResponse


# Create your views here.
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return HttpResponseRedirect("static/index.html")


# TODO remove
@csrf_exempt
def guess(request):
    if request.method == 'POST':
        return post_guess(request)
    elif request.method == 'GET':
        return get_guesses(request)
    else:
        raise Http404()


def post_guess(request):
    data = json.loads(request.body)
    name = data['Name']
    location = data['Location']
    if location is not None and name is not None:
        lat = location['Lat']
        long = location['Long']
        if lat is not None and long is not None:
            print(data)
            return HttpResponse()
    return HttpResponseBadRequest()


def get_guesses(request):
    body = request.body
    return JsonResponse({'A': {'LLArr': [31.710572, -81.731586]}, 'B': {'LLArr': [54.730097, -113.322859]}},
                            safe=False)
