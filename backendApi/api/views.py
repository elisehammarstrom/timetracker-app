#from msilib import sequence
from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer, UserSerializer, StudentSerializer, UserCourseTrackingSerializer, CourseCalendarSerializer, UserFreetimeSerializer, CourseScheduleSerializer, YearGradeSerializer, CourseEvaluationSerializer, QuestionAnswerSerializer, QuestionSerializer
from .models import Course, Programme, User, Student, Teacher, ProgrammeHead, UserCourseTracking, CourseCalendar, UserFreetime, ExcelFile, CourseSchedule, YearGrade, CourseEvaluation, Question, Answer, QuestionAnswer
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.request import Request
from django.utils.dateparse import parse_datetime
from django.db import IntegrityError
from django.http import JsonResponse
from .forms import ExcelForm
from django.http import HttpResponseRedirect
from django.shortcuts import render
import pandas as pd
import os
from pathlib import Path

from django.db.models import Avg
import time
from datetime import date, datetime, timedelta
import json as simplejson
from django.http import HttpResponse
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from datetime import time

#fakkar detta med något?
#from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

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

        if user is not None:
            #user.password = password
            user.is_active = True
            try:
                user = authenticate(email=email, password=password)
                login(request, user)
                response = {
                    "message": "Login was successful", 
                    "token": user.auth_token.key,
                    "userSystemID" : user.pk,
                    "LoggedIn": user.is_authenticated
                } 
                return Response(data=response, status=status.HTTP_200_OK)
            except: 
                response = {
                    "message": "Wrong email or password", 
                } 
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else: 
            response = {
                "message": "Login was unsuccessful. User does not exist"
            } 
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request:Request):
        content = {
            "user": str(request.user),
            "auth": str(request.auth)
        }

        return Response(data=content, status=status.HTTP_200_OK)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request:Request):
        try:
            request.user.is_active = False
            logout(request)
            response = {
                "message": "Logout was successful", 
                "Logged in": request.user.is_authenticated
            } 
            return Response(data=response, status=status.HTTP_200_OK)
        except: 
            response = {
                "message": "Login was unsuccessful. User does not exist"
            } 
            return Response(data=response, status=status.HTTP_200_OK)
        
class PasswordChangeView(APIView):
    #permission_classes = [IsAuthenticated]
    permission_classes = []

    def post(self, request:Request):
        #new_password = request.data.get('new_password')
        print("PASSWORD CHANGE")
        user = request.user
        #password = request.POST['password']

        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        repeat_new_password = request.POST.get('repeat_new_password')
        #print("user.password before change: ", user.password)
        #print("password: ", password)

        if old_password is None:
            response = {
                    "message" : "You must provide old_password"
                }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif new_password is None:
            response = {
                    "message" : "You must provide new_password"
                }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif repeat_new_password is None:
            response = {
                    "message" : "You must provide repeat_new_password"
                }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        if user.check_password(old_password) is False:
            response = {
                    "message" : "Old password isn't correct"
                }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password == repeat_new_password:
            old_user_pw = user.password
            #User = get_user_model()
            print("i if")
            userInstance = get_user_model().objects.get(pk=user.pk)
            userInstance.set_password(new_password)
            userInstance.save()

            authUser = authenticate(email=userInstance.email, password=new_password)
            #user = authenticate(email=email, password=password)

            #user = authenticate(email=email, password=password)
            #login(request, user)
    
            response = {
                "message": "Password changed", 
                "user" : {
                    "id" : userInstance.id,
                    "email": userInstance.email
                },
                "loggedIn": authUser,
                "new_password": userInstance.password,
                "old_user_pw": old_user_pw
            } 
            return Response(data=response, status=status.HTTP_200_OK)
        else:
            response = {
                    "message" : "New password and repeat password doesn't match"
                }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

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
    def add_untracked_time(self, request, **extra_fields):
        user = request.user
        this_user = User.objects.get(id=user.id)
        courseID = request.POST.get('courseID')
        duration = request.POST.get('duration')

        if request.POST.get('date') is None:
            response = {"message": "You must provide a date in format DateFormat '2023-05-01' (date)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif courseID is None: 
            response = {"message": "You must provide a courseID, e.g. 2 (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif duration is None:
            response = {"message": "You must provide a duratiom in format Time 'HH:MM:SS' (duration)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                date = datetime.strptime(request.POST.get('date'),"%Y-%m-%d").date()
                existing_record_object = UserCourseTracking.objects.get(user=User.objects.get(id=user.id), course=Course.objects.get(id=courseID), date=date)

                old_duration = existing_record_object.duration
                add_duration = datetime.strptime(duration, "%H:%M:%S")

                duration_old = timedelta(hours=old_duration.hour, minutes=old_duration.minute, seconds=old_duration.second)
                duration_new = timedelta(hours=add_duration.hour, minutes=add_duration.minute, seconds=add_duration.second)

                updated_duration = duration_old + duration_new
                updated_time_in_time_format = datetime.strptime(str(updated_duration),"%H:%M:%S" ).time()
                existing_record_object.duration = updated_time_in_time_format
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
                return Response(data=response, status=status.HTTP_200_OK)
            except:
                response = {
                    "message": "Error in updating record",      
                    }
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def track_time(self, request, **extra_fields):
        user = request.user
        this_user = User.objects.get(id=user.id)
        courseID = request.POST.get('courseID')
        duration = request.POST.get('duration')

        if request.POST.get('date') is None:
            response = {"message": "You must provide a date in format DateFormat '2023-05-01' (date)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif courseID is None: 
            response = {"message": "You must provide a courseID, e.g. 2 (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif duration is None:
            response = {"message": "You must provide a duratiom in format Time 'HH:MM:SS' (duration)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                date = datetime.strptime(request.POST.get('date'),"%Y-%m-%d").date()
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
    def get_user_course_study_time(self, request, **extra_fields):
        user = request.user
        this_user = User.objects.get(id=user.id)
        startDateRequest = request.POST.get('startDate')
        endDateRequest = request.POST.get('endDate')
        if startDateRequest is None:
            response = {"message": "You need to provide a startDate (startDate). E.g. 2023-01-01"}
            print("type(startDateRequest):", type(startDateRequest))
            print("startDateRequest:", startDateRequest)
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif endDateRequest is None: 
            response = {"message": "You need to provide an endDate (endDate). E.g. 2023-01-01"}
            print("type(endDateRequest):", type(endDateRequest))
            print("endDateRequest:", endDateRequest)
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            startDate = datetime.strptime(startDateRequest,"%Y-%m-%d").date()
            endDate = datetime.strptime(endDateRequest,"%Y-%m-%d").date()
            courseAndDuration = []
            results = []
            for course in this_user.courses.all():
                durationArray = []
                print("course: ", course)
                courseID = course.id
                queryresult = self.queryset.filter(user_id=this_user.id, course_id = courseID, date__range=[startDate, endDate] )
                no_of_dates = abs((endDate-startDate).days) + 1 

                if len(queryresult) == 0:
                    print("No results for those dates for that course. Course: ", course.courseTitle )
                    j = 0
                    while j < no_of_dates:
                        durationArray.append(0)
                        j += 1
                else:
                    i = 0 
                    while i < no_of_dates:
                        futureDate = str(startDate + timedelta(days=i))
                        dateDuration =  self.queryset.filter(user_id=this_user.id, course_id=courseID, date=futureDate).values_list('duration', flat=True)
                        if len(dateDuration) == 0:
                            durationArray.append(0)
                        elif len(dateDuration) is not 0:
                            for timetracked in dateDuration:
                                if timetracked is not None:
                                    if str(timetracked) == "00:00:00":
                                        durationArray.append(0)
                                    else:
                                        totalSeconds = timedelta(hours=timetracked.hour, minutes=timetracked.minute).total_seconds()
                                        totalHours = round(totalSeconds/(60*60), 2)
                                        durationArray.append(totalHours)
                                else: 
                                    durationArray.append(0)
                        else: 
                            print("dateDuration is empty")
                        i+=1
                results.append({
                                "Course" : course.courseTitle, 
                                "courseID" : course.id, 
                                "timeStudied" : durationArray
                            })

            response = {
                            "message": "Time studied per day",  
                            "userID": this_user.id,
                            "user" : this_user.email,
                            "results" : results
                            }
                
            return Response(data=response, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['POST'])
    def get_user_timetracked_per_week(self, request, **extra_fields):
        user = request.user
        this_user = User.objects.get(id=user.id)
        #startDateRequest = request.POST.get('startDate')
        #endDateRequest = request.POST.get('endDate')
        courseID = request.POST.get('courseID')
        if courseID is None: 
            response = {"message": "You need to provide a courseID (courseID). E.g. 2"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            course = Course.objects.get(id=courseID)
            startDate = course.courseStartDateTime
            endDate = course.courseEndDateTime
            #print("startDate.year: ", startDate.year)
            firstWeek = date(startDate.year, startDate.month, startDate.day).isocalendar()[1]
            year_week_string = str(startDate.year) + "-W" + str(firstWeek)
            d = year_week_string
            firstMonday = datetime.strptime(d + '-1', "%Y-W%W-%w")
            #print("firstMonday: ", firstMonday)
            endOfWeek = firstMonday + timedelta(days=6)

            #get all start of week numbers
            thisMonday = firstMonday
            startOfWeeks = []
            endDateTime = datetime.combine(endDate, datetime.min.time())
            
            while thisMonday < endDateTime:
                startOfWeeks.append(thisMonday)
                thisMonday += timedelta(days=7)
            weekObjectArray = []

            for week in startOfWeeks:
                weekEndDate =  week + timedelta(days=6)
                week_avg = 0
                queryresult = self.queryset.filter(user=this_user, course = course, date__range=[week, weekEndDate]).values_list('duration', flat=True)
                no_of_tracking_instances = 0
                total_week_time = timedelta(hours=0, minutes=0, seconds=0)
                
                for timetracked in queryresult:
                   no_of_tracking_instances += 1
                   total_week_time += timedelta(hours=timetracked.hour, minutes=timetracked.minute, seconds=timetracked.second )
                   totalSeconds = total_week_time.total_seconds()
                   hours = total_week_time.total_seconds()/3600
                   week_avg = hours / no_of_tracking_instances
                
                weekObjectArray.append({
                    "weekNo": week.isocalendar()[1],
                    "weekStartDate" : week,
                    "weekEndDate": weekEndDate,
                    "avgDuration" : week_avg
                })

            response = {
                        "message": "Time studied per day",  
                        "userID": this_user.id,
                        "user" : this_user.email,
                        "results" : weekObjectArray
                        }

            return Response(data=response, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['POST'])
    def get_total_timetracked_per_week(self, request, **extra_fields):
        courseID = request.POST.get('courseID')
        if courseID is None: 
            response = {"message": "You need to provide a courseID (courseID). E.g. 2"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            #startDate = datetime.strptime(startDateRequest,"%Y-%m-%d").date()
            #endDate = datetime.strptime(endDateRequest,"%Y-%m-%d").date()
            course = Course.objects.get(id=courseID)
            startDate = course.courseStartDateTime
            endDate = course.courseEndDateTime
            firstWeek = date(startDate.year, startDate.month, startDate.day).isocalendar()[1]
            year_week_string = str(startDate.year) + "-W" + str(firstWeek)

            d = year_week_string
            firstMonday = datetime.strptime(d + '-1', "%Y-W%W-%w")

            endOfWeek = firstMonday + timedelta(days=6)

            #get all start of week numbers
            thisMonday = firstMonday
            startOfWeeks = []

            endDateTime = datetime.combine(endDate, datetime.min.time())
            
            while thisMonday < endDateTime:
                startOfWeeks.append(thisMonday)
                thisMonday += timedelta(days=7)

            weekObjectArray = []

            for week in startOfWeeks:
                weekEndDate =  week + timedelta(days=6)
                week_avg = 0
                print("week no", week.isocalendar()[1])
                queryresult = self.queryset.filter(course = course, date__range=[week, weekEndDate]).values_list('duration', flat=True)

                no_of_tracking_instances = 0

                zero_time =  timedelta(hours=0, minutes=0, seconds=0)

                total_week_time = zero_time 
                zero_time_string = "0" + str(zero_time)

                for timetracked in queryresult:
                   if str(timetracked) != zero_time_string:
                    print(zero_time)
                    print("timetracked", timetracked)
                    no_of_tracking_instances += 1
                    total_week_time += timedelta(hours=timetracked.hour, minutes=timetracked.minute, seconds=timetracked.second )
                    totalSeconds = total_week_time.total_seconds()
                    hours = total_week_time.total_seconds()/3600

                    week_avg = hours / no_of_tracking_instances
                   
                weekObjectArray.append({
                    "weekNo": week.isocalendar()[1],
                    "weekStartDate" : week,
                    "weekEndDate": weekEndDate,
                    "avgDuration" : week_avg

                })

            response = {
                        "message": "Time studied per day",  
                        "results" : weekObjectArray
                        }
                
            return Response(data=response, status=status.HTTP_200_OK)
         
    @action(detail=False, methods=['GET'])
    def get_dates_in_week(self, request, **extra_fields):
        today = date.today()
        dates = []

        if today.isoweekday() == 1:
            #monday
            monday = today
        elif today.isoweekday() == 2:
            #tuesday
            monday = today - timedelta(days=1)
        elif today.isoweekday() == 3:
            #wednesday
            monday = today - timedelta(days=2)
        elif today.isoweekday() == 4:
            #thursday
            monday = today - timedelta(days=3)
        elif today.isoweekday() == 5:
            #friday
            monday = today - timedelta(days=4)
        elif today.isoweekday() == 6:
            #saturday
            monday = today - timedelta(days=5)
        elif today.isoweekday() == 7:
            #sunday
            monday = today - timedelta(days=6)
        else:
            response = {"message": "That date isn't in a week"}    
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        dates.append([monday + timedelta(days=x) for x in range(7)])
        print(dates)

        #remaking dates to format for frontEnd
        dates_for_frontend = []
        

        for item in dates[0]: 
            date_string = item.strftime("%d/%m")
            dates_for_frontend.append(date_string)  

        response = {
                            "message": "Dates",  
                            "dates" : dates_for_frontend,
                            "startDate": dates[0][0],
                            "endDate": dates[0][-1]
                            }
                
        return Response(data=response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def get_course_avg_time(self, request, **extra_fields):
        courseID = request.POST.get('courseID')

        if courseID is None:
            response = {"message": "You need to provide a courseID (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            try: 
                courseInstance = Course.objects.get(id=courseID)
                startDate = courseInstance.courseStartDateTime
                endDate = courseInstance.courseEndDateTime
            except:
                response = {"message": "That course doesn't exist"}
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
            
            queryresult = self.queryset.filter(course = courseInstance, date__range=[startDate, endDate] )

            if len(queryresult) == 0:
                response = {"message": "No results for that course"}
                #return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
                return Response(data=response, status=status.HTTP_200_OK)

            durations = queryresult.values_list('duration', flat=True)
            try:
                print("durations: ", durations)
                seconds = map(lambda time: (time.hour * 60 * 60 ) + (time.minute * 60.0) + time.second, durations)
                
                total_seconds = sum(seconds)
                no_of_instances = len(queryresult)
                if no_of_instances == 0:
                    avg_time = 0
                else:
                    hours = total_seconds/3600
                    avg_time = round(hours/no_of_instances, 2)
                    response = {
                        "message": "Average time",  
                        "avg_time": avg_time,
                        "courseObj": {
                            "courseID": courseInstance.id,
                            "courseStartDate" : courseInstance.courseStartDateTime,
                            "courseEndDate" : courseInstance.courseEndDateTime
                        }
                    }
            
                return Response(data=response, status=status.HTTP_200_OK)
            except:
                response = {"message": "Time isn't correctly tracked"}
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
                
    @action(detail=False, methods=['POST'])
    def get_user_stress_period(self, request, **extra_fields):
        user = request.user
        courseID = request.POST.get('courseID')
        startDateInput = request.POST.get('startDate')
        endDateInput = request.POST.get('endDate')

        courseInstance = Course.objects.get(id=courseID)

        if courseID is None:
            response = {"message": "You need to provide a courseID (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif courseInstance is None:
            response = {"message": "Course does not exist"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif startDateInput is None:
            response = {"message": "You need to provide a startDate (startDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif endDateInput is None: 
            response = {"message": "You need to provide an endDate (endDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            startDate = datetime.strptime(startDateInput,"%Y-%m-%d").date()
            endDate = datetime.strptime(endDateInput,"%Y-%m-%d").date()
            queryresult = self.queryset.filter(user = user, course = courseID, date__range=[startDate, endDate] )
            print("queryresult: ", queryresult)
            if len(queryresult) == 0:
                response = {"message": "No results for those dates"}
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

            userStress = queryresult.values_list('stress', flat=True)

            totalStress = 0
            no_of_objects = 0
            for trackingObj in userStress:
                if trackingObj is not None:
                    totalStress += trackingObj
                    no_of_objects += 1
            if no_of_objects == 0:
                print("no stress is tracked")
                averageStress = 0
            else:
                averageStress = totalStress/no_of_objects

            response = {
                        "message": "Average stress",  
                        "user": user.email,
                        "courseObject": {
                            "courseID" : courseInstance.id,
                            "courseTitle" : courseInstance.courseTitle
                        },
                        "avg_stress": averageStress
                        }
            
            return Response(data=response, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['POST'])
    def track_stress(self, request, **extra_fields):
        user = request.user
        this_user = User.objects.get(id=user.id)
        courseID = request.POST.get('courseID')
        stress = request.POST.get('stress')
        dateInput = request.POST.get('date')
        

        if stress is None:
            response = {"message": "You must provide a stress number (stress)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif dateInput is None:
            response = {"message": "You must provide a date in format 2023-04-01 (date)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            try:
                date = datetime.strptime(dateInput,"%Y-%m-%d").date()
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
            user = Student.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.STUDENT, university=university, programme=Programme.objects.get(id=request.POST.get('pID')), yearGrade=None)
           else:
               #create with no programme or course
               user = Student.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.STUDENT, university=university, programme=pID, yearGrade=None)
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

            userInstance = User.objects.get(id=user.id)
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
    def get_user_data(self, request, **extra_fields):
        userInstance = Student.objects.get(id=request.user.pk)

        response = {
                "message": "Success. User retrieved. ", 
                "userObject": {
                    "fullName" : userInstance.first_name + " " + userInstance.last_name,
                    "email": userInstance.email,
                   "programmeName": userInstance.programme.programmeName,
                   "programmeShortName": userInstance.programme.shortProgrammeName,
                   "university" : userInstance.university

                }
            } 
        return Response(data=response, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['POST'])
    def change_programme(self, request, **extra_fields):
        user = request.user

        if 'programmeID' in request.data: 
            programmeID = request.POST.get('programmeID')
            programmeInstance = Programme.objects.get(id=programmeID)

            userInstance = Student.objects.get(id=user.id)
            userInstance.programme = programmeInstance
            userInstance.save()

            serializer = self.serializer_class(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            response = {'Programme assigned to user: ': str(user.email),
                        "user" : {
                            "first_name" : userInstance.first_name,
                            "programme": userInstance.programme.shortProgrammeName

                        }, 
                        "Programme: ": {
                            "systemID: ": programmeInstance.id,
                            "programmeName: ": programmeInstance.programmeName,
                            "shortProgrammeName: ": programmeInstance.shortProgrammeName,
                            }
            }
            return Response(response, status = status.HTTP_200_OK)
        else:
            response = {"message": "You need to provide a programmeID (e.g. '2' for the programme STS)"}
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
    def get_user_data(self, request, **extra_fields):
        userInstance = Student.objects.get(id=request.user.pk)

        response = {
                "message": "Success. User retrieved. ", 
                "userObject": {
                    "fullName" : userInstance.first_name + " " + userInstance.last_name,
                    "email": userInstance.email,
                   "programmeName": userInstance.programme.programmeName,
                   "programmeShortName": userInstance.programme.shortProgrammeName,
                   "university" : userInstance.university

                }
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
                    "courseID": courseInstance.id,
                    "userObject": {
                        "user.id": userInstance.id,
                        "user.email": userInstance.email,
                        "user.courses": user_courses
                    }
                } 
            return Response(data=response, status=status.HTTP_200_OK)
        

class QuestionAnswerViewset(viewsets.ModelViewSet):
    queryset = QuestionAnswer.objects.all()
    serializer_class = QuestionAnswerSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

class QuestionViewset(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

class CourseEvaluationViewset(viewsets.ModelViewSet):
    queryset = CourseEvaluation.objects.all()
    serializer_class = CourseEvaluationSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    @action(detail=False, methods=['POST'])
    def create_evaluation(self, request, **extra_fields):
        user = self.request.user
        studentInstance = Student.objects.get(pk=user.pk)
        userInstance = studentInstance
        courseID = request.POST.get('courseID')
        course = Course.objects.get(id=courseID)

        if course is None:
            response = {"message": "You need to provide a courseID that corresponds to a course. E.g. 2. (courseID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            questions = [
                "What is your general opinion of the course?", 
                "Was this course difficult?",
                "Does this course have a reasonable workload?",
                "Was this course stressful in general?",
                "If you’ve been to any lectures, were they worth it?", 
                "If you’ve been to any lesson, were they worth it?",
                "If you’ve done any assignments, were they worth it?"
                ]
            try:
                record = CourseEvaluation.objects.create(user=userInstance, course=course)
                record.save()
                questionAnswers = []

                for question in questions:
                    questionObj = Question.objects.create(text=question, courseEvaluation = record)
                    answerObj = Answer.objects.create(number=0, question=questionObj, text="")
                    questionAnswerObj = QuestionAnswer.objects.create(question=questionObj, answer=answerObj, courseEvaluation = record)
                    questionAnswers.append({
                        "questionAnswer.id": questionAnswerObj.id,
                        "question": {
                            "id": questionAnswerObj.question.id,
                            "question": questionAnswerObj.question.text,
                        },
                        "answer": {
                            "id": questionAnswerObj.answer.id,
                            "answerNumber": questionAnswerObj.answer.number,
                            "answerText": questionAnswerObj.answer.text,
                        },
                    }) 
                    questionObj.save()
                    answerObj.save()
                    questionAnswerObj.save()

                response = {
                            "message": "Success. Course Evaluation added.", 
                            "userObject": {
                                "user.id": userInstance.id,
                                "user.email": userInstance.email,
                            },
                            "courseEvaluation": {
                                "id": record.id,
                                "userID" : record.user.id,
                                "courseID" : record.course.id,
                            },
                            "array" : questionAnswers
                        } 
                return Response(data=response, status=status.HTTP_200_OK)
            except IntegrityError as e:
                response = {"message": "CourseEvaluation already exists"}
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['POST'])
    def update_answer(self, request, **extra_fields):
        userInstance = User.objects.get(id=request.user.pk)
        answerNumber = request.POST.get('answerNumber')
        answerID = request.POST.get('answerID')
        answerText = request.POST.get('answerText')

        if answerID is None:
            response = {"message" : "You need to provide an answerID, e.g. 1. (answerID)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif answerNumber is None:
            response = {"message" : "You need to provide an answerNumber, e.g. 2 (answerNumber)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif answerText is None:
            response = {"message" : "You need to provide an answerText, e.g. 2 (answerText)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                answerObj = Answer.objects.get(id=answerID)
                answerObj.number = answerNumber
                answerObj.text = answerText
                answerObj.save()
                
                response = {
                                "message": "Success. Answer updated.", 
                                "userObject": {
                                    "user.id": userInstance.id,
                                    "user.email": userInstance.email,
                                },
                                "answerObject": {
                                    "id": answerObj.id,
                                    "number" : answerObj.number,
                                    "text" : answerObj.text
                                }
                            } 
                return Response(data=response, status=status.HTTP_200_OK)
        
            except ObjectDoesNotExist:
                response = {"message": "That answerID does not exist"}
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def get_course_statistics(self, request, **extra_fields):
        courseID = request.POST.get('courseID')
        if courseID is None: 
            response = {"message": "You must add a courseID (e.g. 2)"}
            return Response(data=response, status=status.HTTP_200_OK) 
        course = Course.objects.get(id=courseID)
        if course is None: 
            reponse = {"message": "Course doesn't exist"}
            return Response(data=response, status=status.HTTP_200_OK)
        queryresult = self.queryset.filter(course = course.id)
        if len(queryresult) == 0:
            response = {"message": "No course evaluations exist for that course"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        
        result = {"courseID" : course.id, 
                  "questionAnswerNumbers": {},
                  "questionAnswerPercentages": {}}
        questionAnswerNumbers = {}
        questionAnswerPercentages = {}

        #initialize with empty values
        evaluation_to_initialize_with = queryresult[0]
        evaluation_qa_result = QuestionAnswer.objects.filter(courseEvaluation = evaluation_to_initialize_with.id)
        for qa in evaluation_qa_result: 
            #spara alla questions i en array
            questionAnswerNumbers.update({qa.question.text: {
                    0:0,
                    1:0,
                    2:0,
                    3:0,
                    4:0,
                    5:0
                }
            })
            questionAnswerPercentages.update({qa.question.text: {
                    0:0.0,
                    1:0.0,
                    2:0.0,
                    3:0.0,
                    4:0.0,
                    5:0.0
                }
            })
        result.update({"questionAnswerNumbers":questionAnswerNumbers})
        result.update({"questionAnswerPercentages":questionAnswerPercentages})

        #add values
        for evaluation in queryresult:
            evaluation_qa_result = QuestionAnswer.objects.filter(courseEvaluation = evaluation.id)
            for qa in evaluation_qa_result: 
                #få svaret för varje fråga
                answerresult = Answer.objects.get(question=qa.question)
                if answerresult.number != 0: #doesnt take account unanswered evaluations
                    questionAnswerNumbers[qa.question.text][answerresult.number] += 1
                   
        response = {"message": "Success. Statistics retrieved.",
                    "result": result} 
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
            
class YearGradeViewset(viewsets.ModelViewSet):
    queryset = YearGrade.objects.all()
    serializer_class = YearGradeSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )        

class CourseScheduleViewset(viewsets.ModelViewSet):
    queryset = CourseSchedule.objects.all()
    serializer_class = CourseScheduleSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    
    @action(detail=False, methods=['POST'])
    def create_schedule(self, request, **extra_fields):
        if 'yearGradeID' not in request.data: 
            response = {"message": "You must provide a yearGradeID as foreinkey to create schedule"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        elif 'courseID' not in request.data:
            response = {"message": "You must provide a courseID as foreinkey to create schedule"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        else:
            course = Course.objects.get(id=request.data.get('courseID'))
            yearGrade=YearGrade.objects.get(id=request.data.get('yearGradeID'))
            module_dir = os.path.dirname(__file__)  # get current
            print("hej")
            get_file = "uploads\\" + str(course.file)
            file_path = os.path.join(module_dir, get_file)
            print(get_file)
            df=pd.read_excel(file_path,skiprows=5)
            pColum=df[df['Program'].str.contains(yearGrade.yearGrade, na=False)]
            listYearGradeClass=[]   
            for item in YearGradeViewset.queryset:
                if yearGrade.yearGrade == item.yearGrade:
                    if yearGrade.yearGradeClass != item.yearGradeClass:
                        listYearGradeClass.append(item.yearGradeClass)
            if len(listYearGradeClass) > 0:
                for val in listYearGradeClass:
                    pColum = pColum[df['Program'] != val]
            dbframe = pColum
            for dbframe in dbframe.itertuples():
                startDateTime = dbframe.Startdatum + " " + dbframe.Starttid + ":00"
                endtDateTime = dbframe.Slutdatum + " " + dbframe.Sluttid + ":00"
                print(startDateTime)
                obj = CourseSchedule.objects.create(courseEvent = dbframe.Moment, 
                                                    eventStartTime =datetime.strptime(startDateTime, '%Y-%m-%d %H:%M:%S'), 
                                                    eventEndTime = datetime.strptime(endtDateTime, '%Y-%m-%d %H:%M:%S'),
                                                    course = course, yearGrade=yearGrade
                                                    
                                                    )                         
                obj.save()

            response ={"message": "Success. Schedule created."}
            return Response(data=response, status=status.HTTP_200_OK)

                    


    
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

