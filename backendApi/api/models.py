from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, User
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import date, datetime, timedelta


class Course(models.Model):
    courseCode = models.CharField(max_length=10, null=True, blank=True)
    courseTitle = models.CharField(max_length=100, null=True, blank=True)
    courseTitleEng = models.CharField(max_length=100, null=True, blank=True)
    courseStartDateTime = models.DateTimeField(null=True, blank=True)
    courseEndDateTime = models.DateTimeField(null=True, blank=True)
    filename = models.CharField(max_length=50, null=True)
    file = models.FileField(null=True)
    
    def __str__(self):
        courseInfoString = self.courseTitle + " (" + self.courseCode + ")"
        return (courseInfoString)

class CourseEvaluation(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, related_name="courseEvaluations") 
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, null=True, related_name="courseEvaluationUser") 
    
    class Meta: 
        unique_together = (("user", "course" ), ) #vi behöver kolla att man 
        #kan ändra sin kursutvärdering och stresslevel
        index_together = (("user", "course" ), )

    def __str__(self):
        courseEvaluationInfoString = "Course:" + self.course.courseTitle + ";" + "User:" + self.user.username + ";"
        return courseEvaluationInfoString 
    
class Question(models.Model):
    text = models.CharField(max_length=200)
    courseEvaluation = models.ForeignKey(CourseEvaluation, on_delete=models.CASCADE, db_constraint=False, blank=True, null=True, related_name='questions')

    def __str__(self):
        return self.text

class Answer(models.Model):
    number = models.IntegerField(blank=True, null=True)
    text = models.CharField(max_length=200, blank=True, null=True)

    question = models.ForeignKey(Question, on_delete=models.CASCADE, db_constraint=False, blank=True, null=True,)

    def __str__(self):
        return "Question: "+self.question.text+", answer: "+self.text

class QuestionAnswer(models.Model):
    courseEvaluation = models.ForeignKey(CourseEvaluation, on_delete=models.CASCADE, db_constraint=False, blank=True, null=True,)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, db_constraint=False, blank=True, null=True,)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, db_constraint=False, blank=True, null=True,)

    def __str__(self):
        return self
    

class UserCourseTracking(models.Model):
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField()
    duration = models.TimeField(blank=True, null=True, default=datetime(2023,3,30).time())

    stress = models.IntegerField(blank=True, null=True, default=0)

    #def __str__(self):
    #   return self
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'course', 'date'], name='unique_user_course_date_combination'
            )
        ]

class Programme(models.Model):
    programmeID = models.CharField(max_length=10)
    programmeName = models.CharField(max_length=100)
    shortProgrammeName = models.CharField(max_length=10, null=True)
    courses = models.ManyToManyField(Course, related_name="programmes", blank=True)

    def __str__(self):
        programmeInfoString =  self.programmeName + "(" + self.programmeID + ") "
        return programmeInfoString

class YearGrade(models.Model):
    yearGrade = models.CharField(max_length=10)
    yearGradeClass = models.CharField(max_length=10)
    programme= models.ForeignKey(Programme,  on_delete=models.CASCADE, blank=True)

    def __str__(self):
        yearGradeInfoString =  self.yearGradeClass
        return yearGradeInfoString 

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        STUDENT = "STUDENT", "Student"
        PROGRAMMEHEAD = "PROGRAMMEHEAD", "ProgrammeHead"
        TEACHER ="TEACHER", "Teacher"

    base_role = Role.ADMIN
    role = models.CharField(max_length=50, choices=Role.choices)
    email = models.EmailField(verbose_name='email address', unique=True)
    courses = models.ManyToManyField(Course, related_name="courses", blank=True) 
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']


    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            self.username = self.first_name + self.last_name
            return super().save(*args, **kwargs)
    
    @classmethod 
    def get_courses(self):
        return self.courses

class ProgrammeHeadManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.PROGRAMMEHEAD)


class ProgrammeHead(User):
    base_role = User.Role.PROGRAMMEHEAD
    university = models.CharField(max_length=70)
    programme= models.ForeignKey(Programme, on_delete=models.CASCADE, blank=True, null=True)
    programmeHead = ProgrammeHeadManager()
    
    def welcome(self):
        return "Only for ProgrammeHead"

class TeacherManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.TEACHER)


class Teacher(User):
    base_role = User.Role.TEACHER
    university = models.CharField(max_length=70)
    #courses= models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    teacher = TeacherManager()
    
    def welcome(self):
        return "Only for Teacher"

class StudentManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.STUDENT)


class Student(User):
    base_role = User.Role.STUDENT
    university = models.CharField(max_length=70, blank=True, null=True)
    programme= models.ForeignKey(Programme, on_delete=models.CASCADE, null=True, blank=True)
    yearGrade = models.ForeignKey(YearGrade, on_delete=models.CASCADE, null=True, blank=True)
    #courses = models.ForeignKey(Course, on_delete=models.CASCADE, blank=True, null=True)

    student = StudentManager()

    def welcome(self):
        return "Only for students"
    
    def __str__(self):
        studentInfoString =  self.email + ", Courses: " + self.courses
        return studentInfoString

class CourseCalendar(models.Model):
     
    class EventType(models.TextChoices):
        SEMINAR = "SEMINAR", "Seminar"
        LABB = "LABB", "Labb"
        ASSIGNMENT = "ASSIGNMENT", "Assignment"
        PRESENTATION = "PRESENTATION", "Presentation"
        EXAMINATION = "EXAMINATION", "Examination"
        PROJECT = "PROJECT", "Project"
        PAPER = "PAPER", "Paper"
    
    course = models.ForeignKey (Course, on_delete=models.CASCADE, null=True)
    eventType = models.CharField(max_length=20, choices=EventType.choices)
    eventName = models.CharField(max_length=50, null = True)
    startDateTime = models.DateTimeField(blank=True, null=True)
    expectedHours= models.IntegerField(blank=True, null=True)
    dueTime = models.DateTimeField()
    mandatory= models.BooleanField(null=True)
    avgHoursDone = models.IntegerField(blank=True, null=True)
    grade = models.CharField(max_length=10, null=True, blank=True)
    eventNumber = models.IntegerField(blank=True, null=True)

             
    
    def __str__(self):
        infoString = self.eventName 
        return infoString


class SeminarManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.SEMINAR)


class Seminar(CourseCalendar):
    class Meta:
        proxy = True

    seminar = SeminarManager()
    
    def __str__(self):
        seminarInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return seminarInfoString


class LabbManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.LABB)


class Labb(CourseCalendar):
   
    class Meta:
        proxy = True

    labb = LabbManager()

    
    def __str__(self):
        labbInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return labbInfoString


class AssignmentManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.ASSIGNMENT)


class Assignment(CourseCalendar):
    class Meta:
        proxy = True

    assignment = AssignmentManager()
    
    def __str__(self):
        assignmentInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return assignmentInfoString 

class PresentationManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.PRESENTATION)


class Presentation(CourseCalendar):
    class Meta:
        proxy = True

    presentation = PresentationManager()
    
    def __str__(self):
        presentationInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return presentationInfoString

class ExaminationManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.EXAMINATION)


class Examination(CourseCalendar):
    class Meta:
        proxy = True

    examination = ExaminationManager()
    
    def __str__(self):
        examinationInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return examinationInfoString

class ProjectManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.PROJECT)


class Project(CourseCalendar):
    class Meta:
        proxy = True

    project = ProjectManager()
    
    def __str__(self):
        projectInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return projectInfoString

class PaperManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.PAPER)


class Paper(CourseCalendar):
    class Meta:
        proxy = True

    paper = PaperManager()
    
    def __str__(self):
        paperInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return paperInfoString

class UserFreetime (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    eventType = "Freetime"
    startDateTime = models.DateTimeField()
    endDateTime = models.DateTimeField()

    def _str_(self):
        userFreetime = self.user + ", " + self.eventType + ", starttid: " + self.startDateTime + ", sluttid: " + self.endDateTime
        return userFreetime



class ExcelFile (models.Model):
   filename = models.CharField(max_length=50)
   file = models.FileField()

class CourseSchedule(models.Model):
    courseEvent = models.CharField(max_length=50)
    eventStartTime = models.DateTimeField()
    eventEndTime = models.DateTimeField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
    yearGrade = models.ForeignKey(YearGrade, on_delete=models.CASCADE, null=True)


    

class MyAssignments(models.Model):
    student = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    assignment = models.ForeignKey(CourseCalendar, on_delete=models.CASCADE, null=True)
    donewith = models.BooleanField(null=True)
    hoursTracked = models.TimeField(blank=True, null=True)

class UserSchedule(models.Model):
   id = models.AutoField(primary_key=True)
   user = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
   event = models.CharField(max_length=50 )
   startDateTime = models.DateTimeField(null=True)
   endDateTime = models.DateTimeField(null=True)
   course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
   
   
   def __str__(self):
        userScheduleInfoString = self.user + "'s schedule"
        return userScheduleInfoString