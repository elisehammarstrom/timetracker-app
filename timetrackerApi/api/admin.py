from django.contrib import admin
from .models import Course, CourseEvaluation, Programme, Calendar

# Register your models here.

admin.site.register(Course)
admin.site.register(CourseEvaluation)
admin.site.register(Programme)
admin.site.register(Calendar)