# Generated by Django 4.2 on 2023-04-21 12:14

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0011_alter_programmehead_programme_alter_teacher_courses"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="student",
            name="university",
        ),
    ]
