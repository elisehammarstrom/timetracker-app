# Generated by Django 4.2 on 2023-04-18 14:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0009_programmehead_programme"),
    ]

    operations = [
        migrations.AddField(
            model_name="teacher",
            name="courses",
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.CASCADE, to="api.course"
            ),
        ),
    ]
