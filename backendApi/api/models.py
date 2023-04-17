from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class Course(models.Model):
    courseCode = models.CharField(max_length=10)
    courseTitle = models.CharField(max_length=100)

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


class Programme(models.Model):
    programmeID = models.CharField(max_length=10)
    programmeName = models.CharField(max_length=100)
    courses = models.ManyToManyField(Course, related_name="programmes")   

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
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            return super().save(*args, **kwargs)


class ProgrammeHeadManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.PROGRAMMEHEAD)


class ProgrammeHead(User):
    base_role = User.Role.PROGRAMMEHEAD
    university = models.CharField(max_length=70)
    #programme= models.ForeignKey(Programme, on_delete=models.CASCADE)

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
    #course= models.ForeignKey(Course, on_delete=models.CASCADE)

    teacher = TeacherManager()
    

    def welcome(self):
        return "Only for Teacher"



class StudentManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=User.Role.STUDENT)


class Student(User):
    base_role = User.Role.STUDENT
    university = models.CharField(max_length=70)
    #programme= models.ForeignKey(Programme, on_delete=models.CASCADE)

    student = StudentManager()


    def welcome(self):
        return "Only for students"

