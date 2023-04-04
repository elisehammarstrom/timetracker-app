from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import Course, CourseEvaluation
from .serializers import CourseSerializer, CourseEvaluationSerializer
from rest_framework.response import Response

# Create your views here.

class CourseViewset(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = (CourseSerializer)

    @action(detail=True, methods=["POST"])
    def rateCourse(self, request, pk=None):
        if 'stresslevel' in request.data: 
            course = Course.objects.get(id=pk)
            print('Course title: ', course.title)
            response = {"message": "it's working"}
            return Response(response, status = status.HTTP_200_OK)
        else: 
            response = {"message": "You need to provide stresslevel"}
            return Response(response, status = status.HTTP_400_OK)
    

class CourseEvaluationViewset(viewsets.ModelViewSet):
    queryset = CourseEvaluation.objects.all()
    serializer_class = (CourseEvaluationSerializer)
    


