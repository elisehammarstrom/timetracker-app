from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer, UserSerializer
from .models import Course, Programme, User, Student, Teacher, ProgrammeHead
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.request import Request
from django.contrib.auth import authenticate

class CourseViewset(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    @action(detail=False, methods=['POST'])
    def create_course(self, request, *args, **kwargs):
        if 'courseCode' in request.data:
            pk = self.kwargs.get('pk')
            pID = request.data['pID']
            if 'courseID' in request.data: 
                programmeObject = Programme.objects.get(id=pID)
                course = request.data['courseID']
                programmeObject.courses.add(course)
                return Response({'status': 'Courses assigned to Programme'})
            else:
                response = {"message": "You need to provide a system ID for the course (courseID)"}
                return Response(response, status = status.HTTP_400_BAD_REQUEST)
        else:
            response = {"message": "You need to provide a courseCode for the course (courseCode)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        
        def get_course_from_courseCode(courseCode):
            print("hej")

            ###for entry in queryset:
             #   if courseCode = entry.Course.


            


class ProgrammeViewset(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer
    authentication_classes = (TokenAuthentication, )
    #permission_classes =(IsAuthenticated, )
    permission_classes =[IsAuthenticated, ]

    @action(detail=False, methods=['POST'])
    def add_course(self, request, *args, **kwargs):
        if 'pID' in request.data:
            pk = self.kwargs.get('pk')
            pID = request.data['pID']
            if 'courseID' in request.data: 
                programmeObject = Programme.objects.get(id=pID)
                course = request.data['courseID']
                programmeObject.courses.add(course)
                return Response({'status': 'Courses assigned to Programme'})
            else:
                response = {"message": "You need to provide a system ID for the course (courseID)"}
                return Response(response, status = status.HTTP_400_BAD_REQUEST)
        else:
            response = {"message": "You need to provide a the system ID for the program (pID)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = []

    def post(self, request:Request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = request.user
        user = authenticate(email=email, password=password)

        if user is not None:
            response = {
                "message": "Login was successful", 
                "token": user.auth_token.key,
                "userSystemID" : user.pk
            } 
            return Response(data=response, status=status.HTTP_200_OK)
        else: 
            response = {
                "message": "Login was unsuccessful. User does not exist"
            } 
            return Response(data=response, status=status.HTTP_200_OK)


    def get(self, request:Request):
        content = {
            "user": str(request.user),
            "auth": str(request.auth)
        }

        return Response(data=content, status=status.HTTP_200_OK)



class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication, )
    #permission_classes = (IsAuthenticated, )
    permission_classes = []
    
    @action(detail=False, methods=['POST'])
    def create_user(self, request, **extra_fields):
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = first_name + last_name
        password = request.POST.get('password')
        role = request.POST.get('role')
        university = request.POST.get('university')
        pID = None
        courseID = None

        if 'pID' in request.data:
            pID = request.POST.get('pID')
        if 'courseID' in request.data:
            courseID = request.POST.get('courseID')

        if role=="Student" or role=="STUDENT": 
           #create with programme 
           if pID != None:
            pID = request.POST.get('pID')
            user = Student.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.STUDENT, university=university, programme=Programme.objects.get(id=request.POST.get('pID')), courses=courseID)
           else:
               #create with no programme or course
               user = Student.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.STUDENT, university=university, programme=pID, courses=courseID)
           user.save()

           #create token
           Token.objects.create(user=user)

           return Response({'status': 'Student added'})
        elif role=="Teacher" or role=="TEACHER":
            #vi skapar teacher utan kurser först
            if courseID is None:
                user= Teacher.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.TEACHER, university=university, courses=None)
            else:
                courses= Course.objects.get(id=courseID)
                user= Teacher.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.TEACHER, university=university, courses=courses)
            user.save()
            Token.objects.create(user=user)
            return Response({'status': 'Teacher added'})
        elif role=="ProgrammeHead" or role=="PROGRAMMEHEAD":
            #create programmehead without programme
            if pID is None:
                user= ProgrammeHead.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.PROGRAMMEHEAD, programme=None, university=university)
            else:
                user= ProgrammeHead.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.PROGRAMMEHEAD, programme=Programme.objects.get(id=pID), university=university)
            user.save()
            Token.objects.create(user=user)
            return Response({'status': 'ProgrammeHead added'})
        else:
           return Response({'status': 'Role does not exist'})
    
    @action(detail=False, methods=['POST'])
    def add_courses(self, request, **extra_fields):
        #markera en kurs i FrontEnd
        #skicka kurskod (ex 1FA104 för Mekanik) till databasen
        #databasen kollar om det finns flera inputs av kurser 
        # med olika datum för kursstart och kursavslut
        #och/eller om det finns ta det datumet som är nyast. 
        #assignar den kurs med nyast datum till användaren

        if 'courseCode' in request.data: 
            courseCode = request.POST.get('courseCode')
            message = 'Courses assigned to user'
            print(CourseViewset.queryset)
            list_w_same_courseCode = []

            for item in CourseViewset.queryset:
                if courseCode == item.courseCode:
                    print("kurs:", item.courseTitle)
                    list_w_same_courseCode.append(item)
            if len(list_w_same_courseCode) > 1:
                print("Many entries with same courseCode exists, taking the newest")
                #go through list and take the oldest object
                newestCourse = list_w_same_courseCode[0]
                for object in list_w_same_courseCode:
                    print("hej")
                    print("object.courseStartDateTime: ", object.courseStartDateTime)
                    print("newest.courseStartDateTime: ", newestCourse.courseStartDateTime)
                    if object.courseStartDateTime > newestCourse.courseStartDateTime:
                        newestCourse = object
                print("this object id is the newest: ", newestCourse.id)
                #asssign this course to user
                user = request.user
                print("user: ", user)

                user.courses.append(newestCourse)
            
            return Response({'status': message})
        else:
            response = {"message": "You need to provide a courseCode for the course (e.g. '1FA104' for the course Mechanics)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        
        
    