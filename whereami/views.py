import itertools
import json
import random

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction, IntegrityError
from django.db.models import Count, Sum, Q, Max, Prefetch, Min
from django.http import HttpResponse, Http404, HttpResponseBadRequest, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils.safestring import mark_safe

from whereami.models import ChallengeLocation, Guess, Challenge, Game, Location


# Create your views here.


# TODO login functionality in angular
# @login_required
def challenges(request):
    challenge_entities = Challenge.objects.annotate(Count('challengelocation'))
    # TODO proper DTOs?
    return JsonResponse({'challenges':
                             [{'id': c.id,
                               'pub_date': c.pub_date,
                               'location_count': c.challengelocation__count,
                               'time': c.time,
                               'game':
                                   {'name': c.game.name}
                               } for c in challenge_entities]})

# TODO login functionality in angular
# @login_required
def games(request):
    game_entities = Game.objects.annotate(Count('locations'))
    return JsonResponse({'games':
                             [{'id': g.id,
                               'name': g.name,
                               'location_count': g.locations__count
                               } for g in game_entities]})


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
                          'Distance': guess.distance, 'Own': guess.user == request.user} for guess in guesses]
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
        ignore_previous_guesses = 'true' == request.GET.get('ignore_previous_guesses', 'false')
        challenge_locations = obj.challengelocation_set
        filtered_ids = []
        if ignore_previous_guesses:
            challenge_locations = challenge_locations.all()
        else:
            guess_set = request.user.guess_set.only('challenge_location').filter(challenge_location__challenge_id=id) \
                .prefetch_related(Prefetch('challenge_location', queryset=ChallengeLocation.objects.all().only('id')))
            filtered_ids = [guess.challenge_location.id for guess in guess_set]
            challenge_locations = challenge_locations.exclude(pk__in=filtered_ids)
        list = [{'Challenge_Location_ID': challenge_location.id,
                 'Lat': challenge_location.location.lat, 'Long': challenge_location.location.long}
                for challenge_location in challenge_locations]
        boundary_array = game_boundary(obj.game)
        response_dict = {'Challenge_ID': id, 'Time': obj.time, 'Challenge_Locations': list,
                         'Ignored_Count': len(filtered_ids), 'boundary_array': boundary_array}
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
            game = Game(name=name[:32])
            game.save()
            db_locations = Location.objects.bulk_create(
                [Location(name=location['Name'][:32], lat=location['Lat'], long=location['Long'], game=game)
                 for location in locations])
            # db_locations only have an id if db driver is postgres
            game.locations.through.objects.bulk_create(
                [game.locations.through(game_id=game.id, location_id=location.id) for location in db_locations])
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
    challenge_locations = challenge.challengelocation_set.all().prefetch_related(
        Prefetch('guess_set', queryset=Guess.objects.order_by('-score')),
        'location')
    users = user_challenge_scores(challenge_id).order_by('-score')
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


def invite(request):
    is_authenticated = request.user.is_authenticated
    boundary_array = []
    api_key = None
    challenge_id = request.GET['Challenge_ID']
    challenge = get_object_or_404(Challenge, id=challenge_id)
    if is_authenticated:
        game = challenge.game
        boundary_array = game_boundary(game)
        api_key = settings.GOOGLE_API_KEY
    return render(request, 'invite.html', {'is_authenticated': is_authenticated, 'full_path': request.get_full_path(),
                                           'boundary_array': mark_safe(json.dumps(boundary_array)),
                                           'google_api_key': api_key, 'challenge': challenge})


def game_boundary(game):
    boundary_array = []
    aggregates = game.locations.aggregate(Min('lat'), Max('lat'), Min('long'), Max('long'))
    # create one coord for each lat/long combination
    for coord in list(itertools.product([aggregates['lat__min'], aggregates['lat__max']],
                                        [aggregates['long__min'], aggregates['long__max']])):
        boundary_array.append({'Lat': coord[0], 'Long': coord[1]})
    any_location = game.locations.first()
    boundary_array.append({'Lat': any_location.lat, 'Long': any_location.long})
    return boundary_array
