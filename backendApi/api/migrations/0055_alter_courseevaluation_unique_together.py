# Generated by Django 4.2 on 2023-05-11 11:19

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0054_alter_courseevaluation_course_and_more"),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="courseevaluation",
            unique_together=set(),
        ),
    ]