# Generated by Django 4.2 on 2023-05-08 07:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0037_alter_answer_question_alter_courseevaluation_course_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="answer",
            name="text",
        ),
        migrations.AddField(
            model_name="answer",
            name="number",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="answer",
            name="question",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.question",
            ),
        ),
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
        migrations.AlterField(
            model_name="courseevaluation",
            name="user",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="question",
            name="courseEvaluation",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.courseevaluation",
            ),
        ),
        migrations.AlterField(
            model_name="questionanswer",
            name="answer",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.answer",
            ),
        ),
        migrations.AlterField(
            model_name="questionanswer",
            name="courseEvaluation",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.courseevaluation",
            ),
        ),
        migrations.AlterField(
            model_name="questionanswer",
            name="question",
            field=models.ForeignKey(
                blank=True,
                db_constraint=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.question",
            ),
        ),
    ]
