# Generated by Django 4.2 on 2023-04-18 13:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0008_programme_shortprogrammename_student_courses_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="programmehead",
            name="programme",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.programme",
            ),
        ),
    ]