from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer
from .models import Course, Programme
from rest_framework import viewsets

# Create your views here.
class CourseViewset(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class ProgrammeViewset(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer
