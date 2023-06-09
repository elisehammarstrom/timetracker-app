# Generated by Django 4.2 on 2023-04-27 11:59

from django.db import migrations, models
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0030_coursecalendar_course'),
    ]

    operations = [
        migrations.CreateModel(
            name='Examination',
            fields=[
            ],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('api.coursecalendar',),
            managers=[
                ('examination', django.db.models.manager.Manager()),
            ],
        ),
        migrations.AddField(
            model_name='coursecalendar',
            name='eventName',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='coursecalendar',
            name='eventType',
            field=models.CharField(choices=[('SEMINAR', 'Seminar'), ('LABB', 'Labb'), ('ASSIGNMENT', 'Assignment'), ('LECTURE', 'Lecture'), ('LESSON', 'Lesson'), ('PRESENTATION', 'Presentation'), ('EXAMINATION', 'Examination')], max_length=20),
        ),
    ]
