from rest_framework import serializers
from .models import Course, Programme, User, Student, UserCourseTracking, CourseCalendar, UserFreetime, CourseSchedule, YearGrade, CourseEvaluation, QuestionAnswer, Question, MyAssignments, UserSchedule, AvailableHours
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
        fields = ("id", "courseCode", "courseTitle", "courseTitleEng", "courseStartDateTime", "courseEndDateTime")

class CourseEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEvaluation
        fields = ("id", "course", "user")


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "text", "courseEvaluation")

class QuestionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = ("id", "question", "answer", "courseEvaluation")


class CourseCalendarSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseCalendar
        fields = ("id", "course","eventType", "eventName", "startDateTime", "expectedHours", "dueTime", "mandatory", "avgHoursDone", "grade", "eventNumber")
    
class UserFreetimeSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserFreetime
        fields = ( "user","eventType", "startDateTime", "endDateTime")

class CourseScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model =CourseSchedule
        fields = ( "courseEvent", "eventStartTime", "eventEndTime", "course", "yearGrade")

class YearGradeSerializer(serializers.ModelSerializer):

    class Meta:
        model =YearGrade
        fields = ( "yearGrade", "yearGradeClass", "programme")


class MyAssignmentsSerializer(serializers.ModelSerializer):

    class Meta:
        model =MyAssignments
        fields = ( "id", "student", "assignment", "donewith", "hoursTracked")

class UserScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSchedule
        fields = ("id","user", "event", "startDateTime", "endDateTime", "course")

class AvailableHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableHours
        fields = ("id","student", "theDate", " availableHours")