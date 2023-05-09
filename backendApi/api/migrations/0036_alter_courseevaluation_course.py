# Generated by Django 4.2 on 2023-05-05 09:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0035_alter_courseevaluation_user"),
    ]

    operations = [
        migrations.AlterField(
            model_name="courseevaluation",
            name="course",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.course",
            ),
        ),
    ]