from rest_framework import serializers
from .models import Course, CourseEvaluation

class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = ("id", "courseCode", "courseTitle")


class CourseEvaluationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CourseEvaluation
        fields = ("id", "course", "user", "stresslevel")