from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer, UserSerializer
from .models import Course, Programme, User
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

# Create your views here.
class CourseViewset(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

class ProgrammeViewset(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes =(IsAuthenticated, )

    @action(detail=False, methods=['POST'])
    #def add_course(self, request, pk):
    def add_course(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        programmeID = request.POST.get('programmeID')
        programmeName = request.POST.get('programmeName')
        shortProgrammeName = request.POST.get('shortProgrammeName')
        if 'courseID' in request.data: 
            programmeObject = Programme.objects.get(id=1)
            print("Programme:", programmeObject)
            course = request.data['courseID']
            programmeObject.courses.add(course)
            return Response({'status': 'Courses assigned to Programme'})
        
        else:
            response = {"message": "You need to provide a courseID"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        





        """if 'courseID' in request.data: 
            programme = Programme.objects.get(id=1)
            print("Programme:", programme)
            courseID = request.data['courseID']
            try:
                print("hej0")
                print(Course.objects.get(id=courseID))
                print("programme.courses:", programme.courses)
                course= Course.objects.get(id=courseID)

                if programme.courses == None: 
                    programme.courses = []
                programme.courses.append(course)
                
                print("hej1")
                serializer = ProgrammeSerializer(programme, many=True)
                print("hej2")

                response = {"message": "Course added to programme", 'result': serializer.data}
                print("hej3")
                return Response(response, status = status.HTTP_200_OK)
            except:
                response ={"message": "That programe or course does not exist"}
                return Response(response,  status = status.HTTP_400_BAD_REQUEST)
        else:
            response = {"message": "You need to provide a courseID"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)"""

        #Programme.addCourses(programmeID=programmeID, programmeName=programmeName, shortProgrammeName=shortProgrammeName)

        #return Response({'status': 'Courses assigned to Programme'})


class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    
    @action(detail=False, methods=['POST'])
    def create_user(self, request, **extra_fields):
        email = request.POST.get('email')
        username = request.POST.get('username')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        password = request.POST.get('password')
        role = request.POST.get('role')

        User.createUser(email=email, username=username, first_name=first_name, last_name=last_name, password=password, role=role)

        return Response({'status': 'user set'})
    
    