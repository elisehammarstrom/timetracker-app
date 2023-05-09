from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer, UserSerializer, StudentSerializer, UserCourseTrackingSerializer, CourseCalendarSerializer, UserFreetimeSerializer, CourseScheduleSerializer, YearGradeSerializer
from .models import Course, Programme, User, Student, Teacher, ProgrammeHead, UserCourseTracking, CourseCalendar, UserFreetime, ExcelFile, CourseSchedule, YearGrade
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
from .forms import ExcelForm
from django.http import HttpResponseRedirect
from django.shortcuts import render
import pandas as pd
import os
from pathlib import Path


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
    permission_classes = []
    
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
            print("HEJ I IF PID")
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
            response = ('Courses assigned to user: ', str(user.email))
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

class CourseCalendarViewset(viewsets.ModelViewSet):
    queryset = CourseCalendar.objects.all()
    serializer_class = CourseCalendarSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )



class UserFreetimeViewset(viewsets.ModelViewSet):
    queryset = UserFreetime.objects.all()
    serializer_class = UserFreetimeSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )       
    
class ExcelFileViewset(viewsets.ModelViewSet):
    model = ExcelFile
    form_class = ExcelForm
    template_name = 'upload.html'
    # def model_form_upload(request):
    #     if request.method == 'POST':
    #         form = ExcelForm(request.POST, request.FILES)
    #         if form.is_valid():
    #             form.save()
    #             return redirect('home')
    #     else:
    #         form = ExcelForm()
    #     return render(request, 'core/model_form_upload.html', {
    #         'form': form
    #     })
    # def upload_file(request):
    #     if request.method == 'POST':
    #         form = UploadFileForm(request.POST, request.FILES)
    #         if form.is_valid():
    #             handle_uploaded_file(request.FILES['file'])
    #             return HttpResponseRedirect('/success/url/')
    #     else:
    #         form = UploadFileForm()
    #     return render(request, 'upload.html', {'form': form})
    def upload_file(request):
        if request.method == 'POST':
            form = ExcelForm(request.POST, request.FILES)
            if form.is_valid():
                # file is saved
                form.save()
                return HttpResponseRedirect('/success/url/')
        else:
            form = ExcelForm()
        return render(request, 'upload.html', {'form': form})


# class newTest():
#     print("hej")
#     module_dir = os.path.dirname(__file__)  # get current 
#     parent_dir = os.path.abspath(os.path.join(module_dir, '..'))
#     print(parent_dir)
#     file_path = os.path.join(module_dir, "uploads\TimeEdit_2023-05-02_16_40.xls") 
#     print(file_path)
#     df=pd.read_excel(file_path,skiprows=5) #, usecols=["Slutdatum"])
#     #print(df[df["Program"] == 'STS2'].head())
#     pColum=df[df['Program'].str.contains('STS2', na=False)]
#     klass = pColum[df['Program'] != 'STS2.B']
#     klassA = klass[df['Program'] != 'STS2.C']
#     print(klassA)
            
         

class CourseScheduleViewset(viewsets.ModelViewSet):
    queryset = CourseSchedule.objects.all()
    serializer_class = CourseScheduleSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    # def create_courseSchedule():
        # print("hej")
        # module_dir = os.path.dirname(__file__)  # get current 
        # parent_dir = os.path.abspath(os.path.join(module_dir, '..'))
        # print(parent_dir)
        # file_path = os.path.join(module_dir, "uploads\TimeEdit_2023-05-02_16_40.xls") 
        # print(file_path)
        # df=pd.read_excel(file_path,skiprows=5) #, usecols=["Slutdatum"])
        # #print(df[df["Program"] == 'STS2'].head())
        # pColum=df[df['Program'].str.contains('STS2', na=False)]
        # klass = pColum[df['Program'] != 'STS2.B']
        # klassA = klass[df['Program'] != 'STS2.C']
        # print(klassA)
        # dbframe = klassA
        # for dbframe in dbframe.itertuples():
        #     startDateTime = dbframe.Startdatum + " " + dbframe.Starttid + ":00"
        #     endtDateTime = dbframe.Slutdatum + " " + dbframe.Sluttid + ":00"
        #     print(startDateTime)
        #     obj = CourseSchedule.objects.create(courseEvent = dbframe.Moment, eventStartTime =datetime.strptime(startDateTime, '%Y-%m-%d %H:%M:%S'), 
        #                                         eventEndTime = datetime.strptime(endtDateTime, '%Y-%m-%d %H:%M:%S'))                         
        #     obj.save()


class YearGradeViewset(viewsets.ModelViewSet):
    queryset = YearGrade.objects.all()
    serializer_class = YearGradeSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )