# Generated by Django 4.2 on 2023-04-26 14:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_assignment_labb_lecture_lesson_presentation'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursecalendar',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.course'),
        ),
    ]