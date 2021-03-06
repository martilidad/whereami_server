# Generated by Django 3.0.6 on 2020-05-07 11:56

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Challenge',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.IntegerField()),
                ('pub_date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
                ('lat', models.FloatField()),
                ('long', models.FloatField()),
                ('pub_date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, unique=True)),
                ('locations', models.ManyToManyField(to='whereami.Location')),
            ],
        ),
        migrations.CreateModel(
            name='ChallengeLocation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('challenge', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='whereami.Challenge')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='whereami.Location')),
            ],
        ),
        migrations.AddField(
            model_name='challenge',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='whereami.Game'),
        ),
        migrations.CreateModel(
            name='Guess',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lat', models.FloatField()),
                ('long', models.FloatField()),
                ('score', models.IntegerField()),
                ('distance', models.IntegerField()),
                ('pub_date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('challenge_location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='whereami.ChallengeLocation')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'challenge_location')},
            },
        ),
    ]
