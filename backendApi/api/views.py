from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer, UserSerializer, StudentSerializer, UserCourseTrackingSerializer
from .models import Course, Programme, User, Student, Teacher, ProgrammeHead, UserCourseTracking
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
from datetime import datetime, timedelta
from django.utils.dateparse import parse_datetime
from django.db import IntegrityError
from django.http import JsonResponse
from django.db.models import Avg
import time

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
        
    @action(detail=False, methods=['GET'])
    def get_programme_data_from_id(self, request, *args, **kwargs):
        if 'id' in request.data:
            id = request.data.get('id')
            programmeObject = Programme.objects.get(id=id)
            #response = {
             #   "message": "You need to provide a system ID for the programme (id)", 
             #   "programmeObject": programmeObject
             #   }
            #return Response(response, status = status.HTTP_200_OK)
            return JsonResponse(programmeObject, safe=False)
        else:
            response = {"message": "You need to provide a the system ID for the program (pID)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        


class LoginView(APIView):
    permission_classes = []

    def post(self, request:Request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = request.user
        user.password = password
        user.is_active = True
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

class StudentViewset(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    authentication_classes = (TokenAuthentication, )
    #permission_classes = (IsAuthenticated, )
    permission_classes = []

class UserCourseTrackingViewset(viewsets.ModelViewSet):
    queryset = UserCourseTracking.objects.all()
    serializer_class = UserCourseTrackingSerializer
    authentication_classes = (TokenAuthentication, )
    #permission_classes = (IsAuthenticated, )
    permission_classes = []

    @action(detail=False, methods=['POST'])
    def track_time(self, request, **extra_fields):
        user = request.user
        this_user = User.objects.get(id=user.id)
        courseID = request.POST.get('courseID')
        duration = request.POST.get('duration')
        date = datetime.strptime(request.POST.get('date'),"%Y-%m-%d").date()

        if duration is None:
            response = {"message": "You must provide a duratiom in format Time 'HH:MM:SS' (duration)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                existing_record_object = UserCourseTracking.objects.get(user=User.objects.get(id=user.id), course=Course.objects.get(id=courseID), date=date)
                existing_record_object.duration = duration
                existing_record_object.save(update_fields=['duration'])
                record = existing_record_object
                
                response = {
                "message": "Record updated",
                "trackedData": 
                        {
                            "userID": record.user.id, 
                            "courseID": record.course.id, 
                            "date": record.date,
                            "duration": record.duration,
                        }       
                }
            except:
                record = UserCourseTracking.objects.create(user=this_user, course=Course.objects.get(id=courseID), date=date, duration=duration)
                record.save()

                response = {
                    "message": "Record added",
                    "trackedData": 
                            {
                                "userID": record.user.id, 
                                "courseID": record.course.id, 
                                "date": record.date,
                                "duration": record.duration,
                            }     
                    }
            return Response(data=response, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['GET'])
    def get_user_course_avg_time(self, request, **extra_fields):
        #get courseID:s earlier?
        user = request.user
        this_user = User.objects.get(id=user.id)
        courseID = request.POST.get('courseID')
        startDate = datetime.strptime(request.POST.get('startDate'),"%Y-%m-%d").date()
        endDate = datetime.strptime(request.POST.get('endDate'),"%Y-%m-%d").date()

        if courseID is None:
            response = {"message": "You need to provide a courseID (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif startDate is None:
            response = {"message": "You need to provide a startDate (startDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif endDate is None: 
            response = {"message": "You need to provide an endDate (endDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            queryresult = self.queryset.filter(user_id=this_user.id, course_id = courseID, date__range=[startDate, endDate] )

            if len(queryresult) == 0:
                response = {"message": "No results for those dates"}
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

            durations = queryresult.values_list('duration', flat=True)
            seconds = map(lambda time: (time.hour * 60 * 60 ) + (time.minute * 60.0) + time.second, durations)
            total_seconds = sum(seconds)
            no_of_instances = len(queryresult)

            avg_time = total_seconds / no_of_instances
            avg_timestamp = time.strftime('%H:%M:%S', time.gmtime(avg_time))

            #gets time studied per day
            no_of_dates = abs((endDate-startDate).days)
            print("----no_of_dates------: ", no_of_dates)
            
            i = 0 
            dateArray = []

            dateHoursDict = {}
            while i < no_of_dates:
                dateArray.append(startDate + timedelta(days=i))
                futureDate = str(startDate + timedelta(days=i))
                i += 1
                timeStudied = self.queryset.filter(user_id=this_user.id, course_id=courseID, date=futureDate).values_list('duration', flat=True)
                dateHoursDict.update({futureDate: timeStudied})

            #return average for the dateselection
            #as well as duration studied for each date
            response = {
                        "message": "Average time",  
                        "userID: ": this_user.id,
                        "user: " : this_user.email,
                        "avg_time": avg_timestamp, 
                        "duration_per_date": dateHoursDict,
                        }
            
            return Response(data=response, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def get_course_avg_time(self, request, **extra_fields):
        #get courseID:s earlier?
        courseID = request.POST.get('courseID')
        startDate = request.POST.get('startDate')
        endDate = request.POST.get('endDate')

        if courseID is None:
            response = {"message": "You need to provide a courseID (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif startDate is None:
            response = {"message": "You need to provide a startDate (startDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif endDate is None: 
            response = {"message": "You need to provide an endDate (endDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            queryresult = self.queryset.filter(course_id = courseID, date__range=[startDate, endDate] )

            if len(queryresult) == 0:
                response = {"message": "No results for those dates"}
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

            durations = queryresult.values_list('duration', flat=True)
            seconds = map(lambda time: (time.hour * 60 * 60 ) + (time.minute * 60.0) + time.second, durations)
            total_seconds = sum(seconds)
            no_of_instances = len(queryresult)

            #måste få course average för varje användare

            #ta fram användarens average per dag
            # och summera date average för användaren

            #gör samma fast för varje user_id i denna metod

            avg_time = total_seconds / no_of_instances
            avg_timestamp = time.strftime('%H:%M:%S', time.gmtime(avg_time))

            response = {
                        "message": "Average time",  
                        "avg_time": avg_timestamp 
                        }
            
            return Response(data=response, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['POST'])
    def track_stress(self, request, **extra_fields):
        user = request.user
        this_user = User.objects.get(id=user.id)
        courseID = request.POST.get('courseID')
        stress = request.POST.get('stress')
        date = datetime.strptime(request.POST.get('date'),"%Y-%m-%d").date()

        if stress is None:
            response = {"message": "You must provide a stress number (stress)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                existing_record_object = UserCourseTracking.objects.get(user=User.objects.get(id=user.id), course=Course.objects.get(id=courseID), date=date)
                existing_record_object.stress = stress
                existing_record_object.save(update_fields=['stress'])
                record = existing_record_object
                
                response = {
                "message": "Record updated",
                "trackedData": 
                        {
                            "userID": record.user.id, 
                            "courseID": record.course.id, 
                            "date": record.date,
                            "stress": record.stress,
                        }       
                }
            except:
                record = UserCourseTracking.objects.create(user=this_user, course=Course.objects.get(id=courseID), date=date, stress=stress)
                record.save()

                response = {
                    "message": "Record added",
                    "trackedData": 
                            {
                                "userID": record.user.id, 
                                "courseID": record.course.id, 
                                "date": record.date,
                                "stress": record.stress,
                            }     
                    }
            return Response(data=response, status=status.HTTP_200_OK)


class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication, )
    #permission_classes = (IsAuthenticated, )
    permission_classes = ()
    
    @action(detail=False, methods=['POST'])
    def create_user(self, request, **extra_fields):
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = email
        password = request.POST.get('password')
        role = request.POST.get('role')
        university = request.POST.get('university')
        pID = None
        courseID = None

        if 'pID' in request.data:
            pID = request.POST.get('pID')

        #användare skapas utan kurser
        #if 'courseID' in request.data:
        #    courseID = request.POST.get('courseID')

        #GÖR OM SÅ COURSES CAN ADDERA COURSE
        #ELLER GÖR SÅ ATT MAN I USER CREATION INTE KAN HA COURSES MED ALLS
        if role=="Student" or role=="STUDENT": 
           #create with programme 
           if pID != None:
            pID = request.POST.get('pID')
            user = Student.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.STUDENT, university=university, programme=Programme.objects.get(id=request.POST.get('pID')))
           else:
               #create with no programme or course
               user = Student.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.STUDENT, university=university, programme=pID)
           user.is_active = True
           user.save()

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
        #print("HEJ ÄR USER: ", user.email)

        if 'courseCode' in request.data: 
            courseCode = request.POST.get('courseCode')
            list_w_same_courseCode = []

            for item in CourseViewset.queryset:
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
                courseInstance = list_w_same_courseCode[0]

            user.courses.add(courseInstance)
            user.save()

            userInstance = User.objects.get(id=25)
            userInstance.save()

            serializer = self.serializer_class(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            #vi sparar id:et på användaren
            #Lägg till så att kursID:et också syns i response
            response = {'Courses assigned to user: ': str(user.email),
                        "course: ": {
                            "systemID: ": courseInstance.id,
                            "courseTitle: ": courseInstance.courseTitle,
                            "courseCode: ": courseInstance.courseCode,
                            "courseStartDateTime: ":courseInstance.courseStartDateTime,
                            "courseEndDateTime: ": courseInstance.courseEndDateTime
                            }
            }
            return Response(response, status = status.HTTP_200_OK)
        else:
            response = {"message": "You need to provide a courseCode for the course (e.g. '1FA104' for the course Mechanics)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['GET'])
    def get_courses(self, request, **extra_fields):
        user_courses_qs = User.objects.get(id=request.user.pk).courses.all()

        user_courses = []
        for course in user_courses_qs:
            user_courses.append(course.id)

        response = {
                "message": "Success. Courses retrieved. ", 
                "courses": user_courses
            } 
        return Response(data=response, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def get_course_data(self, request, **extra_fields):
        if 'courseID' not in request.data: 
            response = {"message": "You must provide a courseID to get course data (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else: 
            courseID = request.POST.get('courseID')
            user_courses_qs = User.objects.get(id=request.user.pk).courses.all()
            courses_qs = Course.objects.get(id=courseID)

            response = {
                    "message": "Success. Course title retrieved.", 
                    "courseData": {
                        "courseID": courses_qs.id, 
                        "course title": courses_qs.courseTitle, 
                        "course code": courses_qs.courseCode
                    }
                } 
            return Response(data=response, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['POST'])
    def remove_course(self, request, **extra_fields):
        if 'courseID' not in request.data: 
            response = {"message": "You must provide a courseID to get remove a course (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else: 
            courseID = request.POST.get('courseID')
            userInstance = User.objects.get(id=request.user.pk)
            user_courses_qs = User.objects.get(id=request.user.pk).courses.all()
            courseInstance = Course.objects.get(id=courseID)
            userInstance.courses.remove(courseInstance)

            user_courses = []
            for course in user_courses_qs:
                user_courses.append(course.id)

            response = {
                    "message": "Success. Course removed.", 
                    "courseID to remove": courseInstance.id,
                    "userObject": {
                        "user.id": userInstance.id,
                        "user.email": userInstance.email,
                        "user.courses": user_courses
                    }
                } 
            return Response(data=response, status=status.HTTP_200_OK)




        
    


            

        

        
        
        
    