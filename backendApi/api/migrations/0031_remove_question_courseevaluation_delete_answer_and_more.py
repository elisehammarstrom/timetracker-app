# Generated by Django 4.2 on 2023-05-04 11:37

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0030_answer_courseevaluation_alter_answer_question_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="question",
            name="courseEvaluation",
        ),
        migrations.DeleteModel(
            name="Answer",
        ),
        migrations.DeleteModel(
            name="Question",
        ),
    ]
