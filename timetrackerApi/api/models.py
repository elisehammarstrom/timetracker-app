from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Course(models.Model):
    courseCode = models.CharField(max_length=10)
    courseTitle = models.CharField(max_length=100)

class CourseEvaluation(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stresslevel = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])

    class Meta: 
        unique_together = (("user", "course" ), ) #vi behöver kolla att man 
        #kan ändra sin kursutvärdering och stresslevel
        index_together = (("user", "course" ), )


