from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        STUDENT = "STUDENT", "Student"
        PROGRAMMEHEAD = "PROGRAMMEHEAD", "ProgrammeHead"

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
