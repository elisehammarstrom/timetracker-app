from rest_framework import serializers
from .models import Course, Programme, User
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password")
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        token = Token.objects.create(user=user)
        print("token: ", token)
        return user
    

    
class ProgrammeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programme
        fields = ("id", "programmeID", "programmeName", "courses")

class CourseSerializer(serializers.ModelSerializer):
    programmes = ProgrammeSerializer(many=True)

    class Meta:
        model = Course
        fields = ("id", "courseCode", "courseTitle", "programmes")