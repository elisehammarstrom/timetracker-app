# Generated by Django 4.2 on 2023-05-08 19:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_coursschedule'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='CoursSchedule',
            new_name='CourseSchedule',
        ),
    ]
