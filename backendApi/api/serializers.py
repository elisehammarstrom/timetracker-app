from rest_framework import serializers
from .models import Course, Programme, User
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "role", "password")
        extra_kwargs = {"password": {"write_only": True, "required": True}}

        #def create(self, validated_data):
        #    user = User.objects.create_user

    
class ProgrammeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programme
        fields = ("id", "programmeID", "programmeName", "courses", "shortProgrammeName")

class CourseSerializer(serializers.ModelSerializer):
    #programmes = ProgrammeSerializer(many=True)

    class Meta:
        model = Course
        #fields = ("id", "courseCode", "courseTitle", "programmes")
        fields = ("id", "courseCode", "courseTitle")