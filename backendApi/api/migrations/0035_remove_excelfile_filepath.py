# Generated by Django 4.2 on 2023-05-08 19:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_excelfile_filepath_alter_excelfile_file'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='excelfile',
            name='filepath',
        ),
    ]
