# Generated by Django 4.0.1 on 2022-01-31 15:07

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0004_remove_tournamnets_user_tournamnets_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tournamnets',
            name='users',
        ),
        migrations.AddField(
            model_name='tournamnets',
            name='competitors',
            field=models.ManyToManyField(blank=True, related_name='competitions', to=settings.AUTH_USER_MODEL),
        ),
    ]
