# Generated by Django 4.2 on 2023-05-04 10:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0029_remove_courseevaluation_stresslevel_question_answer"),
    ]

    operations = [
        migrations.AddField(
            model_name="answer",
            name="courseEvaluation",
            field=models.ForeignKey(
                default="",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="answers",
                to="api.course",
            ),
        ),
        migrations.AlterField(
            model_name="answer",
            name="question",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="answerlist",
                to="api.question",
            ),
        ),
        migrations.AlterField(
            model_name="question",
            name="courseEvaluation",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="questions",
                to="api.courseevaluation",
            ),
        ),
    ]
