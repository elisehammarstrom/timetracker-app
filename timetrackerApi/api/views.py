from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import Course, CourseEvaluation
from .serializers import CourseSerializer, CourseEvaluationSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User

# Create your views here.

class CourseViewset(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    
    @action(detail=True, methods=["POST"])
    def rateCourse(self, request, pk=None):
        if 'stresslevel' in request.data: 
            course = Course.objects.get(id=pk)
            print("queryset CourseViewset: ", CourseEvaluation.objects.all())
            stresslevel = request.data['stresslevel']
            user = User.objects.get(id=1)
            print('user', user.username)
            #print(CourseEvaluation.objects.get(user=user.id, course=course.id))
            # print('Course title: ', course.courseTitle)

            try: 
                print("i try")
                courseEvaluation = CourseEvaluation.objects.get(course=course.id, user=user.id)
                courseEvaluation.stresslevel = stresslevel 
                courseEvaluation.save()
                serializer = CourseEvaluationSerializer(courseEvaluation, many=False)
                response = {"message": "Course evaluation updated", 'result': serializer.data}
                return Response(response, status = status.HTTP_200_OK)


            except:
                print("i except")
                courseEvaluation = CourseEvaluation.objects.create(user=user, course=course, stresslevel=stresslevel)
                serializer = CourseEvaluationSerializer(courseEvaluation, many=False)
                response = {"message": "Course evaluation created", 'result': serializer.data}
                return Response(response, status = status.HTTP_200_OK)


            #response = {"message": "it's working"}
            #return Response(response, status = status.HTTP_200_OK)
        else: 
            response = {"message": "You need to provide stresslevel"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
    

class CourseEvaluationViewset(viewsets.ModelViewSet):
    queryset = CourseEvaluation.objects.all()
    serializer_class = CourseEvaluationSerializer
    print("queryset CourseEvalViewset: ", queryset)
    


