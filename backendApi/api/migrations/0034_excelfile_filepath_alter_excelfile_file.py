# Generated by Django 4.2 on 2023-05-08 19:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0033_excelfile'),
    ]

    operations = [
        migrations.AddField(
            model_name='excelfile',
            name='filepath',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='excelfile',
            name='file',
            field=models.FileField(upload_to=''),
        ),
    ]
