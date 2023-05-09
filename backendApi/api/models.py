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
    filename = models.CharField(max_length=50, null=True)
    file = models.FileField(null=True)

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
        yearGradeInfoString =  self.yearGradeName
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

class CourseCalendar(models.Model):
     
    class EventType(models.TextChoices):
        SEMINAR = "SEMINAR", "Seminar"
        LABB = "LABB", "Labb"
        ASSIGNMENT = "ASSIGNMENT", "Assignment"
        LECTURE ="LECTURE", "Lecture"
        LESSON = "LESSON", "Lesson"
        PRESENTATION = "PRESENTATION", "Presentation"
        EXAMINATION = "EXAMINATION", "Examination"
    
    course = models.ForeignKey (Course, on_delete=models.CASCADE, null=True)
    eventType = models.CharField(max_length=20, choices=EventType.choices)
    eventName = models.CharField(max_length=50, null = True)
    startDateTime = models.DateTimeField()
    endDateTime = models.DateTimeField()
    expectedHours= models.IntegerField(blank=True, null=True)
    dueTime = models.DateTimeField(blank=True, null=True)
    mandatory= models.BooleanField(null=True)


    def save(self, *args, **kwargs):
        print("self.eventType: ", self.eventType)
        if self.eventType == "SEMINAR":
            #or "Seminar" or "LABB" or "Labb" or "PRESENTATION" or "Presentation":
            print("self.eventType: ", self.eventType)
            self.dueTime = self.startDateTime
            return super().save(*args, **kwargs)
        elif self.eventType == "LABB":
            #or "Seminar" or "LABB" or "Labb" or "PRESENTATION" or "Presentation":
            print("self.eventType: ", self.eventType)
            self.dueTime = self.startDateTime
            return super().save(*args, **kwargs)
        elif self.eventType == "PRESENTATION":
            print("self.eventType: ", self.eventType)
            self.dueTime = self.startDateTime
            return super().save(*args, **kwargs)
        elif self.eventType == "EXAMINATION":
            print("self.eventType: ", self.eventType)
            self.dueTime = self.startDateTime
            return super().save(*args, **kwargs)
        
        elif self.eventType == "ASSIGNMENT":
            print("hej")
            self.dueTime = self.endDateTime
            return super().save(*args, **kwargs)  
             
    
    def __str__(self):
        return self


class SeminarManager(BaseUserManager):
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


class LabbManager(BaseUserManager):
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


class AssignmentManager(BaseUserManager):
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

class LessonManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.LESSON)


class Lesson(CourseCalendar):
    class Meta:
        proxy = True

    lesson = LessonManager()
    
    def __str__(self):
        lessonInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return lessonInfoString

class LectureManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.LECTURE)


class Lecture(CourseCalendar):
    class Meta:
        proxy = True

    lecture = LectureManager()
    
    def __str__(self):
        lectureInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return lectureInfoString

class PresentationManager(BaseUserManager):
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

class ExaminationManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(eventType=CourseCalendar.EventType.PRESENTATION)


class Examination(CourseCalendar):
    class Meta:
        proxy = True

    examination = ExaminationManager()
    
    def __str__(self):
        examinationInfoString =  self.eventType + ", DueTime: " + self.dueTime
        return examinationInfoString

class UserFreetime (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    eventType = "Freetime"
    startDateTime = models.DateTimeField()
    endDateTime = models.DateTimeField()

    def _str_(self):
        userFreetime = self.user + ", " + self.eventType + ", starttid: " + self.startDateTime + ", sluttid: " + self.endDateTime
        return userFreetime


# class UserSchedule(models.Model):
#    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
#    event = models.CharField(max_length=30 )
#    startDateTime = models.DateTimeField()
#    endDateTime = models.DateTimeField()
   
   
#    def __str__(self):
#         userScheduleInfoString = self.user + "'s schedule"
#         return userScheduleInfoString
class ExcelFile (models.Model):
   filename = models.CharField(max_length=50)
   file = models.FileField()

class CourseSchedule(models.Model):
    courseEvent = models.CharField(max_length=50)
    eventStartTime = models.DateTimeField()
    eventEndTime = models.DateTimeField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
    yearGrade = models.ForeignKey(YearGrade, on_delete=models.CASCADE, null=True)
    

# class MyAssignments(models.Model):
#     student = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True) to=settings.AUTH_USER_MODEL,
#     assignment = models.ForeignKey(CourseCalendar, on_delete=models.CASCADE, null=True)
#     donewith = models.BooleanField(null=True)
#     hoursTracked = models.TimeField(blank=True, null=True)