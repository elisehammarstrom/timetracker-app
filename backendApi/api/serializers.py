from rest_framework import serializers
from .models import Course, Programme


class ProgrammeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programme
        fields = ("id", "programmeID", "programmeName", "courses")

class CourseSerializer(serializers.ModelSerializer):
    programmes = ProgrammeSerializer(many=True)

    class Meta:
        model = Course
        fields = ("id", "courseCode", "courseTitle", "programmes")