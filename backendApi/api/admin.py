from django.contrib import admin
from .models import Course, Programme, User, ExcelFile

# Register your models here.
admin.site.register(Course)
admin.site.register(Programme)
admin.site.register(User)
admin.site.register(ExcelFile)