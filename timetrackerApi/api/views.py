from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import Course, CourseEvaluation
from .serializers import CourseSerializer, CourseEvaluationSerializer, UserSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.
class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CourseViewset(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    authentication_classes = (TokenAuthentication, )
     
     
    @action(detail=True, methods=["POST"])
    def rateCourse(self, request, pk=None):
        if 'stresslevel' in request.data: 
            course = Course.objects.get(id=pk)
            print("queryset CourseViewset: ", CourseEvaluation.objects.all())
            stresslevel = request.data['stresslevel']
            user = request.user
            print('user', user.username)

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

        else: 
            response = {"message": "You need to provide stresslevel"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
    

class CourseEvaluationViewset(viewsets.ModelViewSet):
    queryset = CourseEvaluation.objects.all()
    serializer_class = CourseEvaluationSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    print("queryset CourseEvalViewset: ", queryset)

    def update(self, request, *args, **kwargs):
        response = {"message": "You can't update a course evaluation like that"}
        return Response(response, status = status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        response = {"message": "You can't create a course evaluation like that"}
        return Response(response, status = status.HTTP_400_BAD_REQUEST)

    


