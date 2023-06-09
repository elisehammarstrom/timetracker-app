# Generated by Django 4.2 on 2023-05-05 12:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_alter_courseevaluation_course'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courseevaluation',
            name='course',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.course'),
        ),
        migrations.AlterField(
            model_name='courseevaluation',
            name='user',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]
