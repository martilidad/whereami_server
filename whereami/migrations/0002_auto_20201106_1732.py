# Generated by Django 3.0.7 on 2020-11-06 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('whereami', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guess',
            name='distance',
            field=models.FloatField(),
        ),
    ]
