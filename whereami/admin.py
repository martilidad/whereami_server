import django.db.models.fields.related as related
import django.db.models.fields.reverse_related as reverse_related
from django.contrib import admin

from whereami.models import Location, Game, Challenge, ChallengeLocation, Guess

# Register your models here.
RELATION_EXCEPTIONS = [related.ManyToManyField, reverse_related.ManyToOneRel]


def get_valid_fields(model):
    valid_fields = model._meta.get_fields()
    valid_fields = filter(lambda x: type(x) not in RELATION_EXCEPTIONS, valid_fields)
    return [field.name for field in valid_fields]


admin.site.register(Location)


class GameAdmin(admin.ModelAdmin):
    list_display = get_valid_fields(Game)


admin.site.register(Game, GameAdmin)


class ChallengeAdmin(admin.ModelAdmin):
    list_display = get_valid_fields(Challenge)


admin.site.register(Challenge, ChallengeAdmin)
admin.site.register(ChallengeLocation)
admin.site.register(Guess)
