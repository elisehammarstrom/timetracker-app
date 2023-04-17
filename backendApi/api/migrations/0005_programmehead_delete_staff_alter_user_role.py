# Generated by Django 4.2 on 2023-04-13 09:08

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_delete_student_alter_user_email_student"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProgrammeHead",
            fields=[
                (
                    "user_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                ("university", models.CharField(max_length=70)),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
            bases=("api.user",),
            managers=[
                ("programmeHead", django.db.models.manager.Manager()),
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.DeleteModel(
            name="Staff",
        ),
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("ADMIN", "Admin"),
                    ("STUDENT", "Student"),
                    ("PROGRAMMEHEAD", "ProgrammeHead"),
                ],
                max_length=50,
            ),
        ),
    ]