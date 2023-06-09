# Generated by Django 4.2 on 2023-05-16 09:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0058_delete_userschedule'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserSchedule',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('event', models.CharField(max_length=50)),
                ('startDateTime', models.DateTimeField(null=True)),
                ('endDateTime', models.DateTimeField(null=True)),
                ('course', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.course')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.student')),
            ],
        ),
    ]
