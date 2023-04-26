from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, User
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings

class Course(models.Model):
    courseCode = models.CharField(max_length=10, null=True, blank=True)
    courseTitle = models.CharField(max_length=100, null=True, blank=True)
    courseStartDateTime = models.DateTimeField(null=True, blank=True)
    courseEndDateTime = models.DateTimeField(null=True, blank=True)

    #programmes = fields.ForeignKey(Programme, on_delete=models.CASCADE)

    # def no_of_evaluations(self):
    #     courseEvaluations = CourseEvaluation.objects.filter(course = self)
    #     return len(courseEvaluations)
    
    # def avg_of_evaluations(self):
    #     sum = 0
    #     courseEvaluations = CourseEvaluation.objects.filter(course = self)

    #     for evaluation in courseEvaluations:
    #         sum += evaluation.stresslevel
    #     if len(courseEvaluations) > 0:
    #         return sum / len(courseEvaluations)
    #     else:
    #         return 0 
    
    def __str__(self):
        courseInfoString = self.courseTitle + " (" + self.courseCode + ")"
        return courseInfoString

class UserCourseTracking(models.Model):
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField()
    duration = models.TimeField(blank=True, null=True)

    stress = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self
    
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
    #courses = models.ForeignKey(Course, on_delete=models.CASCADE, blank=True, null=True)

    student = StudentManager()

    def welcome(self):
        return "Only for students"
    
    def __str__(self):
        studentInfoString =  self.email + ", Courses: " + self.courses
        return studentInfoString