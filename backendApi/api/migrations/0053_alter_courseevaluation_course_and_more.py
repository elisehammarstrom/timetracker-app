# Generated by Django 4.2 on 2023-05-10 15:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0052_alter_courseevaluation_unique_together_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="courseevaluation",
            name="course",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="course",
                to="api.course",
            ),
        ),
        migrations.AlterField(
            model_name="courseevaluation",
            name="user",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="user",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
