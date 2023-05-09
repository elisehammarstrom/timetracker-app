# Generated by Django 4.2 on 2023-04-26 14:21

from django.db import migrations
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_coursecalendar_seminar'),
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('api.coursecalendar',),
            managers=[
                ('assignment', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='Labb',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('api.coursecalendar',),
            managers=[
                ('labb', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='Lecture',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('api.coursecalendar',),
            managers=[
                ('lecture', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('api.coursecalendar',),
            managers=[
                ('lesson', django.db.models.manager.Manager()),
            ],
        ),
        migrations.CreateModel(
            name='Presentation',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('api.coursecalendar',),
            managers=[
                ('presentation', django.db.models.manager.Manager()),
            ],
        ),
    ]
