from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

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


