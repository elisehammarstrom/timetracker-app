from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer, UserSerializer, StudentSerializer
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

        
        print("Email: ", email)
        print("password: ", password)
        user = request.user
        user.password = password
        user.is_active = True
        print("User: ", user)
        print("user.is_active:", user.is_active)
        user = authenticate(email=email, password=password)
        print("user2: ", user)

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

class StudentViewset(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    authentication_classes = (TokenAuthentication, )
    #permission_classes = (IsAuthenticated, )
    permission_classes = []


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
        username = email

        
        
        """ if (first_name != None) and (last_name != None):
            
        else:
            return Response({'status': 'You need to provide first_name and last_name'})
            """

        password = request.POST.get('password')
        role = request.POST.get('role')
        university = request.POST.get('university')
        pID = None
        courseID = None

        if 'pID' in request.data:
            pID = request.POST.get('pID')


        #if 'courseID' in request.data:
        #    courseID = request.POST.get('courseID')

        #GÖR OM SÅ COURSES CAN ADDERA COURSE
        #ELLER GÖR SÅ ATT MAN I USER CREATION INTE KAN HA COURSES MED ALLS
        if role=="Student" or role=="STUDENT": 
           #create with programme 
           if pID != None:
            pID = request.POST.get('pID')
            print("HEJ I IF PID")
            user = Student.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.STUDENT, university=university, programme=Programme.objects.get(id=request.POST.get('pID')))
           else:
               #create with no programme or course
               user = Student.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.STUDENT, university=university, programme=pID)
           user.is_active = True
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
            user.is_active = True
            user.save()
            Token.objects.create(user=user)
            return Response({'status': 'Teacher added'})
        elif role=="ProgrammeHead" or role=="PROGRAMMEHEAD":
            #create programmehead without programme
            if pID is None:
                user= ProgrammeHead.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.PROGRAMMEHEAD, programme=None, university=university)
            else:
                user= ProgrammeHead.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.PROGRAMMEHEAD, programme=Programme.objects.get(id=pID), university=university)
            user.is_active = True
            user.save()
            Token.objects.create(user=user)
            return Response({'status': 'ProgrammeHead added'})
        else:
           return Response({'status': 'Role does not exist'})
    
    @action(detail=False, methods=['POST'])
    def add_course(self, request, **extra_fields):
        user = request.user
        #if user.role != 'STUDENT' or :
        #    response = {"message": "You need to be a STUDENT to enrol in a course"}
        #   return Response(response, status = status.HTTP_400_BAD_REQUEST)

        if 'courseCode' in request.data: 
            courseCode = request.POST.get('courseCode')
            list_w_same_courseCode = []

            for item in CourseViewset.queryset:
                print("item: ", item)
                if courseCode == item.courseCode:
                    list_w_same_courseCode.append(item)
                    #courseInstance = item
            if len(list_w_same_courseCode) > 1:
                print("Many entries with same courseCode exists, taking the newest")
                newestCourse = list_w_same_courseCode[0]
                for object in list_w_same_courseCode:
                    if object.courseStartDateTime > newestCourse.courseStartDateTime:
                        newestCourse = object        
                courseInstance = newestCourse
            else:
                print("TVÅ")
                courseInstance = list_w_same_courseCode[0]

            user.courses.add(courseInstance)
            user.save()

            #vi sparar id:et på användaren
            #Lägg till så att kursID:et också syns i response
            response = ('Courses assigned to user: ', str(user.email))
            return Response(response, status = status.HTTP_200_OK)
        else:
            response = {"message": "You need to provide a courseCode for the course (e.g. '1FA104' for the course Mechanics)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['GET'])
    def get_courses(self, request, **extra_fields):
        user = request.user


        print("HEJ")
        """
        print("self: ", self)

        print("user: ", user)
        print("user.courses: ", user.courses)

        print(self)

        print(self.request.user.courses)

        self.save()

        pk = self.kwargs.get('pk')
            pID = request.data['pID']
            if 'courseID' in request.data: 
                programmeObject = Programme.objects.get(id=pID)
        """



        #print("user.courses:", user.courses)

        #if user.id is not None:
            #for courseObject in user.courses: 
             #   print("Hej igen")

        
        
        
        response = {"message": "success "}
        return Response(response, status = status.HTTP_200_OK)
        #if user.id is not None:
        #    print("här ska en loop över användarens kurser samt kurserna i queryset finnas")
            
        #else:
        #    response = {"message": "You need to provide a user ID to see courses (id) "}
        #    return Response(response, status = status.HTTP_400_BAD_REQUEST)
            

        

        
        
        
    