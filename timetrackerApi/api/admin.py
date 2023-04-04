from django.contrib import admin
from .models import Course, CourseEvaluation

# Register your models here.

admin.site.register(Course)
admin.site.register(CourseEvaluation)