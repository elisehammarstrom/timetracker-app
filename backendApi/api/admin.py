from django.contrib import admin
from .models import Course, Programme, User, ExcelFile, CourseSchedule, Student, CourseCalendar, AvailableHours

# Register your models here.
admin.site.register(Course)
admin.site.register(Programme)
admin.site.register(User)
admin.site.register(ExcelFile)
admin.site.register(CourseSchedule)
admin.site.register(CourseCalendar)
admin.site.register(AvailableHours)