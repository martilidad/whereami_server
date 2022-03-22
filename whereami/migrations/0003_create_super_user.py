from django.db import migrations

from django.contrib.auth import get_user_model
from django.conf import settings

def create_superuser():
    if settings.INITIAL_SUPER_USER is not None and settings.INITIAL_SUPER_PW is not None:
        User = get_user_model()
        User.objects.create_superuser(username=settings.INITIAL_SUPER_USER, password=settings.INITIAL_SUPER_PW)


class Migration(migrations.Migration):
    dependencies = [
        ('whereami', '0002_auto_20201106_1732'),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
