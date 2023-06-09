from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime
import uuid

# Create your models here.
class MyUserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        # Creates and saves a User with the given email, date of
        # birth and password.
       
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        # Creates and saves a superuser with the given email, date of
        # birth and password.
      
        user = self.create_user(
            email,
            password=password,
            name=name,
        )

        user.is_admin = True
        user.save(using=self._db)
        return user

class CustomStudent(AbstractBaseUser):
    email = models.EmailField(verbose_name='email address',
        max_length=255,
        unique=True,)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_teacher = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    """def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True """

    USERNAME_FIELD = "email"
    REQUIRED_FELDS=[]
    #objects = CustomUserManager()
    def _str_(self):
        studentInfo = self.email
        return studentInfo  
    @property
    def is_teacher(self):
        #"Is the user a teacher?"
        return self.teacher

    @property
    def is_admin(self):
        #"Is the user a admin member?"
        return self.admin    


class Course(models.Model):
    courseCode = models.CharField(max_length=10)
    courseTitle = models.CharField(max_length=100)

    def no_of_evaluations(self):
        courseEvaluations = CourseEvaluation.objects.filter(course = self)
        return len(courseEvaluations)
    
    def avg_of_evaluations(self):
        sum = 0
        courseEvaluations = CourseEvaluation.objects.filter(course = self)

        for evaluation in courseEvaluations:
            sum += evaluation.stresslevel
        if len(courseEvaluations) > 0:
            return sum / len(courseEvaluations)
        else:
            return 0 
    
    def __str__(self):
        courseInfoString = self.courseTitle + " (" + self.courseCode + ")"
        return (courseInfoString)


class CourseEvaluation(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stresslevel = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])

    class Meta: 
        unique_together = (("user", "course" ), ) #vi behöver kolla att man 
        #kan ändra sin kursutvärdering och stresslevel
        index_together = (("user", "course" ), )

    def __str__(self):
        courseEvaluationInfoString = "Course:" + self.course.courseTitle + ";" + "User:" + self.user.username + ";"
        return courseEvaluationInfoString 

class Programme(models.Model):
    programmeID = models.CharField(max_length=10)
    programmeName = models.CharField(max_length=100)
    courses = models.ManyToManyField(Course, related_name="programmes")   

    def __str__(self):
        programmeInfoString =  self.programmeName + "(" + self.programmeID + ") "
        return programmeInfoString 
    

#tillfällig ska kopplas till User senare
class Calendar(models.Model):
    #ska troligtvis ändras till models.ForeignKey(User.userID,  )  senare 
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    calendarID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    courseID = models.ForeignKey(Course, on_delete=models.CASCADE)
    datetimeNow = datetime.now()
    hours = 2
    stresslevel = 3

    def __str__(self):
        #calendarInfoString =  "calendarID: " + self.calendarID + ";userID:" + self.userID + ";"
        calendarInfoString =  "calendarID: " + str(self.calendarID)
        return calendarInfoString




