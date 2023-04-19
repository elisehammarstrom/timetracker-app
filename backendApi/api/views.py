from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer, UserSerializer
from .models import Course, Programme, User, Student, Teacher, ProgrammeHead
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

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

class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    
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
           return Response({'status': 'Student added'})
        elif role=="Teacher" or role=="TEACHER":
            #vi skapar teacher utan kurser först
            if courseID is None:
                user= Teacher.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.TEACHER, university=university, courses=None)
            else:
                courses= Course.objects.get(id=courseID)
                user= Teacher.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.TEACHER, university=university, courses=courses)
            user.save()
            return Response({'status': 'Teacher added'})
        elif role=="ProgrammeHead" or role=="PROGRAMMEHEAD":
            #create programmehead without programme
            if pID is None:
                user= ProgrammeHead.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.PROGRAMMEHEAD, programme=None, university=university)
            else:
                user= ProgrammeHead.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.PROGRAMMEHEAD, programme=Programme.objects.get(id=pID), university=university)
            user.save()
            return Response({'status': 'ProgrammeHead added'})
        else:
           return Response({'status': 'Role does not exist'})
        


        
    """
    @action(detail=False, methods=['GET'])
    def get_current_user(self, request, *args, **kwargs): 
        current_user = request.user
        response = {"message": "User returned"}
        #return Response(response, status = status.HTTP_200_OK)  
        return (current_user, Response(response, status = status.HTTP_200_OK))
        
    @action(detail=False, methods=['POST'])
    def add_course_to_student(self, request, *args, **kwargs):
        print("in method")
        #metoden antar att vi har ett 
        #front-end skapar användare, och hämtar systemId:et från deras användarobject
        current_user = request.user
        print (current_user.id)
        print(current_user)
    
        if 'courseID' in request.data:
                studentObject = Student.objects.get(id=current_user.id) 
                print("studentObject: ", studentObject)
                
                courseID = request.data['courseID']
                courseObject = Course.objects.get(id=courseID)
                print("current_user.role: ", current_user.role)
                print("studentObject.courses:", studentObject.courses)
                #studentObject.add(courseObject)

                

                #if hasattr(current_user, 'STUDENT'):
                #    print("är student")
                    


                #current_user.courses.add(courseObject)
            
                print("courseObject: ", courseObject)
                response = {"message": "Course added to user"}
                return Response(response, status = status.HTTP_200_OK)
        else:
            response = {"message": "You need to provide a ID for the course (courseID)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST) 
        if 'email' in request.data:
            print("in if")
            pk = self.kwargs.get('pk')
            print("pk:", pk)
            user_email = request.data['email'] 
            print("user_email: ", user_email)
            user_id = request.user.id
            print("user_id:", user_id)
            print("DONE")
            if 'courseID' in request.data:
                userObject = User.objects.get(id=user_id) 
                #figure out instance
                print("userObject: ", userObject)
                #print(userObject.)
                
                courseID = request.data['courseID']
                courseObject = Course.objects.get(id=courseID)
                #userObject.courses.add(courseObject)
                print("courseObject: ", courseObject)
                response = {"message": "Course added to user"}
                return Response(response, status = status.HTTP_200_OK)
            else:
                response = {"message": "You need to provide a ID for the course (courseID)"}
                return Response(response, status = status.HTTP_400_BAD_REQUEST)
        else: 
            response = {"message": "You need to provide the email-adress of user"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
"""