from rest_framework import serializers
from .models import Course, Programme, User, Student, UserCourseTracking, CourseCalendar, UserFreetime, CourseSchedule, YearGrade
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "role", "password", "courses")
        extra_kwargs = {
            "password": {"write_only": True, "required": True}, 
            "first_name": {"required": True},
            "last_name": {"required": True},
                        }

        #def create(self, validated_data):
        #    user = User.objects.create_user

class UserCourseTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourseTracking
        #fields = ("userID", "course", "date", "timeTracked", "stress")
        fields = ("id", "user", "course", "date", "duration", "stress")
        extra_kwargs = {
            "course": {"required": True}, 
            "date": {"required": True},
            }

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("id", "email", "first_name", "last_name", "role", "password", "courses")
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
        fields = ("id", "courseCode", "courseTitle", "courseStartDateTime", "courseEndDateTime")

class CourseCalendarSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseCalendar
        fields = ("id", "course","eventType", "eventName", "startDateTime", "endDateTime", "expectedHours", "dueTime", "mandatory")

class UserFreetimeSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFreetime
        fields = ( "user","eventType", "startDateTime", "endDateTime")

class CourseScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model =CourseSchedule
        fields = ( "courseEvent", " eventStartTime", "eventEndTime")

class YearGradeSerializer(serializers.ModelSerializer):

    class Meta:
        model =YearGrade
        fields = ( "yearGrade", "yearGradeClass", " programme")