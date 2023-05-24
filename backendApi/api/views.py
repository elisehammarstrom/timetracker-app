#from msilib import sequence
from django.shortcuts import render
from .serializers import CourseSerializer, ProgrammeSerializer, UserSerializer, StudentSerializer, UserCourseTrackingSerializer, CourseCalendarSerializer, UserFreetimeSerializer, CourseScheduleSerializer, YearGradeSerializer, CourseEvaluationSerializer, QuestionAnswerSerializer, QuestionSerializer, MyAssignmentsSerializer, UserScheduleSerializer, AvailableHoursSerializer, OptimalScheduleSerializer
from .models import Course, Programme, User, Student, Teacher, ProgrammeHead, UserCourseTracking, CourseCalendar, UserFreetime, ExcelFile, CourseSchedule, YearGrade, CourseEvaluation, Question, Answer, QuestionAnswer, MyAssignments, UserSchedule, AvailableHours, OptimalSchedule
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.request import Request
from django.db import IntegrityError
from django.http import JsonResponse
from .forms import ExcelForm
from django.http import HttpResponseRedirect
from django.shortcuts import render
import pandas as pd
import os
from datetime import date, datetime, timedelta
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from datetime import time
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
import numpy as np
import holidays
from django.contrib.auth import get_user

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
        
    @action(detail=False, methods=['POST'])
    def update_course(self, request, *args, **kwargs):
        courseID = request.POST.get('courseID')
        courseTitle = request.POST.get('courseTitle')
        courseTitleEng = request.POST.get('courseTitleEng')
        courseStartDateTime = request.POST.get('courseStartDateTime')
        courseEndDateTime = request.POST.get('courseEndDateTime')

        if courseID is None:
            response = {"message": "You must provide a courseID (courseID)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        
        try:
            courseInstance = Course.objects.get(id=courseID)
        except:
            response = {"message": "Course with that courseID doesn't exist"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        
        if courseTitle is not None:
            courseInstance.courseTitle = courseTitle
            courseInstance.save()
        
        if courseTitleEng is not None:
            courseInstance.courseTitleEng = courseTitleEng
            courseInstance.save()
        
        if courseStartDateTime is not None:
            courseInstance.courseStartDateTime = courseStartDateTime
            courseInstance.save()
        
        if courseEndDateTime is not None:
            courseInstance.courseEndDateTime = courseEndDateTime
            courseInstance.save()

        if (courseTitle is None) and (courseTitleEng is None) and (courseStartDateTime is None) and (courseEndDateTime is None):
            response = {"message": "Provide either courseTitle, courseTitleEng, courseStartDateTime or courseEndDateTime to update the course"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)

        response = {"message": "Course data updated",
                    "courseObj": {
                        "id": courseInstance.id,
                        "courseCode": courseInstance.courseCode,
                        "courseTitle": courseInstance.courseTitle,
                        "courseTitleEng": courseInstance.courseTitleEng,
                        "courseStartDateTime": courseInstance.courseStartDateTime,
                        "courseEndDateTime": courseInstance.courseEndDateTime,
                    }}
        return Response(response, status = status.HTTP_200_OK)

class ProgrammeViewset(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer
    permission_classes =[AllowAny,]
    authentication_classes = (TokenAuthentication, )

    @action(detail=False, methods=['POST'])
    def add_course(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            response = {"message": "You must be authenticated"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
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
        user = request.user
        if not user.is_authenticated:
            response = {"message": "You must be authenticated"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        
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
            response = {"message": "You must provide a duration in format Time 'HH:MM:SS' (duration)"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            date = datetime.strptime(request.POST.get('date'),"%Y-%m-%d").date()
            add_duration = datetime.strptime(duration, "%H:%M:%S")
            duration_new = timedelta(hours=add_duration.hour, minutes=add_duration.minute, seconds=add_duration.second)
            try: 
                existing_record_object = UserCourseTracking.objects.get(user=User.objects.get(id=user.id), course=Course.objects.get(id=courseID), date=date)
                old_duration = existing_record_object.duration
                duration_old = timedelta(hours=old_duration.hour, minutes=old_duration.minute, seconds=old_duration.second)
                updated_duration = duration_old + duration_new
            except:
                updated_duration = duration_new
                existing_record_object = UserCourseTracking.objects.create(user=User.objects.get(id=user.id), course=Course.objects.get(id=courseID), date=date)
               
            updated_time_in_time_format = datetime.strptime(str(updated_duration),"%H:%M:%S").time()
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
    def get_user_day_study_time(self, request, **extra_fields):
        user = request.user
        this_user = User.objects.get(id=user.id)
        today = datetime.today()

        user_courses_qs = User.objects.get(id=request.user.pk).courses.all()

        resultArray = []
        for course in user_courses_qs:
            queryresult = self.queryset.filter(user_id=this_user.id, date=today, course=course)
            if len(queryresult) > 0:
                duration = str(queryresult[0].duration)
            else:
                zero_time =  timedelta(hours=0, minutes=0, seconds=0)
                zero_time_string = "0" + str(zero_time)
                duration = zero_time_string
            resultArray.append({
                "courseID" : course.id,
                "coursecourseTitle": course.courseTitle,
               "duration": duration
            })

        response = {
                            "message": "Time studied today",  
                            "userID": this_user.id,
                            "user" : this_user.email,
                            "results" : resultArray
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
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif endDateRequest is None: 
            response = {"message": "You need to provide an endDate (endDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            startDate = datetime.strptime(startDateRequest,"%Y-%m-%d").date()
            endDate = datetime.strptime(endDateRequest,"%Y-%m-%d").date()
            courseAndDuration = []
            results = []
            for course in this_user.courses.all():
                durationArray = []
                courseID = course.id
                queryresult = self.queryset.filter(user_id=this_user.id, course_id = courseID, date__range=[startDate, endDate] )
                no_of_dates = abs((endDate-startDate).days) + 1 

                if len(queryresult) == 0:
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
        courseID = request.POST.get('courseID')
        user = request.user
        userInstance = Student.objects.get(id=user.pk)
        try: 
            userCourse = userInstance.courses.get(id=courseID)
        except:
            response = {
                    "message": "Course with that id doesn't exist"
                    }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        
        delta = userCourse.courseEndDateTime - userCourse.courseStartDateTime
        firstDate = userCourse.courseStartDateTime
        dates_first_week = self.get_weekdates(firstDate)
        weekArray = []
        
        #get no of weeks in base course & populate with base course timetrackings
        d = dates_first_week[0][0].date()
        d2 = userCourse.courseEndDateTime.date()
        step = timedelta(days=7)
        week_no = 1
        
        while d < d2:
            weekStart = d
            weekEnd = d+timedelta(days=6)
            timetrackedObj_per_week = self.queryset.filter(user = userInstance, course = userCourse, date__range=[weekStart, weekEnd]).values_list('duration', flat=True)
            weekArray.append({week_no: []})
            for timetracked in timetrackedObj_per_week: 
                weekArray[week_no-1][week_no].append(timetracked)
            week_no += 1
            d += step

        #NOW GET AVERAGES PER WEEK
        avgTimePerWeekIntArray = []
        weekNoArray = []

        for weekObj in weekArray:
            zero_time = timedelta(hours=0, minutes=0, seconds=0)
            zero_time_string = "0" + str(zero_time)
            total_week_time = zero_time
            timetracked_count = 0
            week_avg = zero_time
            weekNoArray.append(next(iter(weekObj)))
            weekKey = next(iter(weekObj))
            for timetracked in weekObj[weekKey]:
                if str(timetracked) != zero_time_string:
                    if timetracked is not None:
                        total_week_time += timedelta(hours=timetracked.hour, minutes=timetracked.minute, seconds=timetracked.second )
                        timetracked_count += 1          
            hours = total_week_time.total_seconds()/3600
            if timetracked_count is 0:
                week_avg = 0
            else:
                week_avg = round(hours / timetracked_count, 2)

            avgTimePerWeekIntArray.append(week_avg)

        response = {
                    "message": "Avg time studied per week for courses with same courseCode", 
                    "user" : {
                        "email": user.email
                    },
                    "userCourse": userCourse.courseTitle,
                    "weekNoArray" : weekNoArray,
                    "weekDurationArray" : avgTimePerWeekIntArray
                    }
        return Response(data=response, status=status.HTTP_200_OK)
    

    def get_weekdates(self, startDate):
        dates_of_week = []
        if startDate.isoweekday() == 1:
            #monday
            monday = startDate
        elif startDate.isoweekday() == 2:
            #tuesday
            monday = startDate - timedelta(days=1)
        elif startDate.isoweekday() == 3:
            #wednesday
            monday = startDate - timedelta(days=2)
        elif startDate.isoweekday() == 4:
            #thursday
            monday = startDate - timedelta(days=3)
        elif startDate.isoweekday() == 5:
            #friday
            monday = startDate - timedelta(days=4)
        elif startDate.isoweekday() == 6:
            #saturday
            monday = startDate - timedelta(days=5)
        elif startDate.isoweekday() == 7:
            #sunday
            monday = startDate - timedelta(days=6)
        else: 
            print("Weekday doesn't exist")  

        dates_of_week.append([monday + timedelta(days=x) for x in range(7)])
        return dates_of_week


    @action(detail=False, methods=['POST'])
    def get_compared_total_timetracked_per_week(self, request, **extra_fields):
        courseID = request.POST.get('courseID')
        user = request.user
        userInstance = Student.objects.get(id=user.pk)
        try: 
            userCourse = userInstance.courses.get(id=courseID)
        except:
            response = {
                    "message": "Course with that id doesn't exist"
                    }
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        
        delta = userCourse.courseEndDateTime - userCourse.courseStartDateTime
        daylist = list(range(0,delta.days))

        filtered_queryresult = Course.objects.get_queryset().filter(courseCode = userCourse.courseCode)
        firstDate = userCourse.courseStartDateTime
        dates_first_week = self.get_weekdates(firstDate)
        weekArray = []
        
        #get no of weeks in base course & populate with base course timetrackings
        d = dates_first_week[0][0].date()
        d2 = userCourse.courseEndDateTime.date()
        step = timedelta(days=7)
        week_no = 1
        
        while d < d2:
            weekStart = d
            weekEnd = d+timedelta(days=6)
            timetrackedObj_per_week = self.queryset.filter(course = userCourse, date__range=[weekStart, weekEnd]).values_list('duration', flat=True)
            weekArray.append({week_no: []})
            for timetracked in timetrackedObj_per_week: 
                weekArray[week_no-1][week_no].append(timetracked)
            week_no += 1
            d += step
        maximum_nr_of_weeks = len(weekArray)
        last_day_first_week = dates_first_week[0][-1]

        for courseObj in filtered_queryresult:
            if courseObj.id is not userCourse.id:
                dates_first_week = self.get_weekdates(courseObj.courseStartDateTime)
                d = dates_first_week[0][0].date()
                week_no = 1

                while week_no <= maximum_nr_of_weeks:
                    weekStart = d
                    weekEnd = d+timedelta(days=6)
                    timetrackedObj_per_week = self.queryset.filter(course = courseObj, date__range=[weekStart, weekEnd]).values_list('duration', flat=True)
                    for timetracked in timetrackedObj_per_week: 
                        weekArray[week_no-1][week_no].append(timetracked)
                    week_no += 1
                    d += step


        #NOW GET AVERAGES PER WEEK
        avgTimePerWeek = []
        avgTimePerWeekIntArray = []
        weekNoArray = []
        #week_no = 1

        for weekObj in weekArray:
            zero_time = timedelta(hours=0, minutes=0, seconds=0)
            zero_time_string = "0" + str(zero_time)
            total_week_time = zero_time
            timetracked_count = 0
            print("weekObj", weekObj)
            week_avg = zero_time
            weekNoArray.append(next(iter(weekObj)))
            weekKey = next(iter(weekObj))
            for timetracked in weekObj[weekKey]:
                if str(timetracked) != zero_time_string:
                    if timetracked is not None:
                        total_week_time += timedelta(hours=timetracked.hour, minutes=timetracked.minute, seconds=timetracked.second )
                        timetracked_count += 1          
            hours = total_week_time.total_seconds()/3600
            if timetracked_count is 0:
                week_avg = 0
                week_avg_string = zero_time_string
            else:
                week_avg = round(hours / timetracked_count, 2)
            #week_no += 1

            avgTimePerWeekIntArray.append(week_avg)
            weekDurationArray = avgTimePerWeekIntArray

            #weekNoArray = list(range(1, maximum_nr_of_weeks+1))

        response = {
                    "message": "Avg time studied per week for courses with same courseCode", 
                    "user" : {
                        "email": user.email
                    },
                    "userCourse": userCourse.courseTitle,
                    "weekNoArray" : weekNoArray,
                    #"weekDurationArray" : weekDurationArray,
                    "weekDurationArray" : avgTimePerWeekIntArray
                    }
        return Response(data=response, status=status.HTTP_200_OK)
         
    @action(detail=False, methods=['GET'])
    def get_dates_in_week(self, request, **extra_fields):
        today = date.today()
        dates = self.get_weekdates(today)

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
    def get_user_course_avg_time(self, request, **extra_fields):
        courseID = request.POST.get('courseID')
        user = request.user
        this_user = User.objects.get(id=user.id)

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
            
            zero_time =  timedelta(hours=0, minutes=0, seconds=0)
            zero_time_string = "0" + str(zero_time)
            queryresult = self.queryset.filter(user=this_user, course = courseInstance, date__range=[startDate, endDate] )
            if len(queryresult) == 0:
                avg_time = zero_time_string
                response = {
                        "message": "Average time",  
                        "avg_time": avg_time,
                    }
                return Response(data=response, status=status.HTTP_200_OK)
            
            durations = queryresult.values_list('duration', flat=True)
            no_of_tracking_instances = 0
            total_time = zero_time

            for duration in durations:
                 if str(duration) != zero_time_string:
                    no_of_tracking_instances += 1
                    total_time += timedelta(hours=duration.hour, minutes=duration.minute, seconds=duration.second )
            hours = total_time.total_seconds()/3600
            
            if no_of_tracking_instances == 0:
                avg_time = 0
            avg_time = round(hours / no_of_tracking_instances, 2)
            avg_time_string = str(timedelta(hours=avg_time))            

            response = {
                    "message": "Average time",  
                    "avg_time": avg_time_string,
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
            
            zero_time =  timedelta(hours=0, minutes=0, seconds=0)
            zero_time_string = "0" + str(zero_time)

            #get all course Obj
            courseQueryset = Course.objects.get_queryset().filter(courseCode = courseInstance.courseCode)
            allCourseObjDurations = []
            for courseObj in courseQueryset:
                courseObjInstance = Course.objects.get(id=courseObj.id)
                queryresult = self.queryset.filter(course = courseObjInstance, date__range=[startDate, endDate]).values_list('duration', flat=True)
                for timetracked in queryresult:
                    if str(timetracked) != zero_time_string:
                        allCourseObjDurations.append(timetracked)

            if len(allCourseObjDurations) == 0:
                avg_time = zero_time_string
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
            
            durations = allCourseObjDurations
            try:
                no_of_instances = len(allCourseObjDurations)
                if no_of_instances == 0:
                    avg_time = 0
                else:
                    no_of_tracking_instances = 0
                    total_time = zero_time
          
                    for duration in durations:
                        if str(duration) != zero_time_string:
                            no_of_tracking_instances += 1
                            total_time += timedelta(hours=duration.hour, minutes=duration.minute, seconds=duration.second )
                    hours = total_time.total_seconds()/3600
                    avg_time = round(hours/no_of_instances, 2)
                    avg_time_string = str(timedelta(hours=avg_time))

                    response = {
                        "message": "Average time",  
                        "avg_time": avg_time_string,
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
        
    def get_average(self, iterable):
        totalNumber = 0
        no_of_objects = 0
        average = 0
        for obj in iterable:
            if obj is not None:
                totalNumber += obj
                no_of_objects += 1
            if no_of_objects == 0:
                average = 0
            else:
                average = round(totalNumber/no_of_objects, 2)
        return average
    
    def get_queryresult_based_on_dates_or_courseDates(self, course, user, startDateInput, endDateInput):
        if (startDateInput is '') or (endDateInput is ''):
            #use courseDates
            startDate = course.startDate
            endDate = course.endDate
        else:
            #use inputDates
            startDate = datetime.strptime(startDateInput,"%Y-%m-%d").date()
            endDate = datetime.strptime(endDateInput,"%Y-%m-%d").date()
        
        if user is False:
            #get for general course
            queryresult = self.queryset.filter(course = course, date__range=[startDate, endDate] )
        else:
            #get for the specific user
            queryresult = self.queryset.filter(user = user, course = course, date__range=[startDate, endDate] )
        return queryresult
                
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
        elif startDateInput is None:
            response = {"message": "You need to provide a startDate (startDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        elif endDateInput is None: 
            response = {"message": "You need to provide an endDate (endDate). E.g. 2023-01-01"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        else:
            try: 
                courseInstance = Course.objects.get(id=courseID)
            except: 
                response = {"message": "Course does not exist"}
                return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

            queryresult = self.get_queryresult_based_on_dates_or_courseDates(course=courseInstance, user=user, startDateInput=startDateInput, endDateInput=endDateInput)
            userStress = queryresult.values_list('stress', flat=True)
            averageStress = self.get_average(userStress)

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
    def get_stress_period_all(self, request, **extra_fields):
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
            
            #get all course Obj
            courseQueryset = Course.objects.get_queryset().filter(courseCode = courseInstance.courseCode)
            allCourseObjStress = []
            for courseObj in courseQueryset:
                courseObjInstance = Course.objects.get(id=courseObj.id)
                queryresult = self.queryset.filter(course = courseObjInstance, date__range=[startDate, endDate]).values('stress')
                for stresstracked in queryresult:
                    if stresstracked['stress'] is not None:
                        allCourseObjStress.append(stresstracked['stress'])

            if len(allCourseObjStress) == 0:
                avg_stress = 0
                response = {
                        "message": "Average stress",  
                        "avg_time": avg_stress,
                        "courseObj": {
                            "courseID": courseInstance.id,
                            "courseStartDate" : courseInstance.courseStartDateTime,
                            "courseEndDate" : courseInstance.courseEndDateTime
                        }
                    }
            
                return Response(data=response, status=status.HTTP_200_OK)
            
            stressArray = allCourseObjStress
            try:
                no_of_instances = len(stressArray)

                if no_of_instances == 0:
                    avg_stress = 0
                else:
                    no_of_tracking_instances = 0
                    total_stress = 0
          
                    for stress in stressArray:
                        no_of_tracking_instances += 1
                        total_stress += stress
                            
                    avg_stress = round(total_stress/no_of_instances, 2)
                response = {
                        "message": "Average time",  
                        "avg_stress": avg_stress,
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
                user = Teacher.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.TEACHER, university=university, courses=None)
            else:
                courses = Course.objects.get(id=courseID)
                user = Teacher.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email, password=password, role=User.Role.TEACHER, university=university, courses=courses)
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
    def update_yearGrade(self, request, **extra_fields):
        if 'yearGradeClass' not in request.data:
            response = {"message": "You must provide a yearGradeClass as foreinkey to update yearGrade"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        else:
            userObject = Student.objects.get(id=request.user.pk)
            yearGrade = YearGrade.objects.get(yearGradeClass=request.data.get('yearGradeClass'))
            userObject.yearGrade = yearGrade
            Student.objects.filter(id=request.user.pk).update(yearGrade=yearGrade)
            response = {
                    "message": "Success. User yearGrade updated.", 
                    "userObject": {
                        "user.id": userObject.id,
                        "user.email": userObject.email,
                        "user.yeargrade": userObject.yearGrade.yearGradeClass,
                        "added yeargrade": yearGrade.yearGradeClass
                    }
                } 
            return Response(data=response, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def change_programme(self, request, **extra_fields):
        user = request.user

        if 'programmeID' in request.data: 
            programmeID = request.POST.get('programmeID')
            programmeInstance = Programme.objects.get(id=programmeID)

            userInstance = Student.objects.get(pk=user.id)
            Student.objects.filter(pk=user.id).update(programme=programmeInstance)
            userInstance.save()
            serializer = self.serializer_class(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            response = {'Programme assigned to user': str(user.email),
                        "userID" : user.id,
                        "Programme": {
                            "systemID": userInstance.programme.id,
                            "programmeName": userInstance.programme.programmeName,
                            "shortProgrammeName": userInstance.programme.shortProgrammeName,
                            }
            }
            return Response(response, status = status.HTTP_200_OK)
        else:
            response = {"message": "You need to provide a programmeID (e.g. '2' for the programme STS)"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['POST'])
    def add_course(self, request, **extra_fields):
        user = request.user

        if 'courseCode' in request.data: 
            courseCode = request.POST.get('courseCode')
            list_w_same_courseCode = []

            for item in CourseViewset.queryset:
                if courseCode == item.courseCode:
                    list_w_same_courseCode.append(item)
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
                   "university" : userInstance.university,
                   "yearGrade": userInstance.yearGrade
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
            response = {"message": "Course doesn't exist"}
            return Response(data=response, status=status.HTTP_200_OK)
        queryresult = self.queryset.filter(course = course.id)
        if len(queryresult) == 0:
            response = {"message": "No course evaluations exist for that course"}
            return Response(data=response, status=status.HTTP_200_OK)
        
        result = {"courseID" : course.id, 
                  "questionAnswerNumbers": {},
                  "questionAnswerPercentages": {}}
        questionAnswerNumbers = {}
        questionAnswerPercentages = {}

        #initialize with empty values
        evaluation_to_initialize_with = queryresult[0]
        evaluation_qa_result = QuestionAnswer.objects.filter(courseEvaluation = evaluation_to_initialize_with.id)
        for qa in evaluation_qa_result: 
            questionAnswerNumbers.update({qa.question.text: {
                    1:0,
                    2:0,
                    3:0,
                    4:0,
                    5:0
                }
            })
            questionAnswerPercentages.update({qa.question.text: {
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
        
        total_answers = 0
        for question in questionAnswerNumbers:
            total_answers = sum(questionAnswerNumbers[question].values())
            for key, value in questionAnswerNumbers[question].items():
                if total_answers != 0:
                    questionAnswerPercentages[question][key] = 100 * round(float(value) / float(total_answers), 3)

        response = {"message": "Success. Statistics retrieved.",
                    "total_answers": total_answers,
                    "result": result} 
        return Response(data=response, status=status.HTTP_200_OK)

class CourseCalendarViewset(viewsets.ModelViewSet):
    queryset = CourseCalendar.objects.all()
    serializer_class = CourseCalendarSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    # df=pd.read_excel("C:\Users\PC\OneDrive\Dokument\testladdaupp.xlsx",skiprows=5) #, usecols=["Slutdatum"])
    # dbframe= df
    # for dbframe in dbframe.itertuples():
    #     obj = CourseCalendar.objects.create(courseEvent = dbframe.Moment, 
    #                                                 eventStartTime =datetime.strptime(startDateTime, '%Y-%m-%d %H:%M:%S'), 
    #                                                 eventEndTime = datetime.strptime(endtDateTime, '%Y-%m-%d %H:%M:%S'),
    #                                                 course = course, yearGrade=yearGrade
                                                    
    #                                                 )                         
    #     obj.save()




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
    permission_classes = (AllowAny, )
    @action(detail=False, methods=['POST'])
    def get_yearGrades(self, request, **extra_fields):
        if 'programmeName' not in request.data: 
            response = {"message": "You must provide a programmeName as foreinkey to get yearGrades"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        else:
            programme_id= Programme.objects.get(programmeName=request.data.get("programmeName")).id
            yearGradeNameList= list(YearGrade.objects.filter(programme_id=programme_id).values_list('yearGradeClass', flat=True))
            response ={"message": "Success. YearGrades retrieved.",
                       "yearGrades": yearGradeNameList}
            return Response(data=response, status=status.HTTP_200_OK)



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

                    
class MyAssignmentsViewset(viewsets.ModelViewSet):
    queryset = MyAssignments.objects.all()
    serializer_class = MyAssignmentsSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    @action(detail=False, methods=['POST'])
    def add_assignment(self, request, **extra_fields):
        if 'assignmentID' not in request.data: 
            response = {"message": "You must provide a assignmentID as foreinkey to add assignment"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        else:
            userObject = User.objects.get(id=request.user.pk)
            theassignment = CourseCalendar.objects.get(id=request.data.get('assignmentID'))
            myAssignments =list(MyAssignments.objects.filter(student_id=request.user.pk).values_list('assignment_id', flat=True))
            for item in myAssignments:
                savedAssignment = CourseCalendar.objects.get(id=item)
                if savedAssignment.course_id == theassignment.course_id:
                    if savedAssignment.eventNumber == theassignment.eventNumber:
                        response = {"message": "This assignment is already added"}
                        return Response(response, status = status.HTTP_400_BAD_REQUEST)
            newAssignment= MyAssignments.objects.create(student=userObject, assignment=CourseCalendar.objects.get(id=request.data.get('assignmentID')),
                                                        donewith=False, hoursTracked='00:00:00')
            newAssignment.save()
            course = Course.objects.get(id=newAssignment.assignment.course_id)
            response ={ "message": "Success. Assignment added to user.", 
                        "userObject": {
                            "user.id": userObject.id,
                            "user.email": userObject.email,
                        },
                        "assignmentObject":{
                            "assignment.id": newAssignment.id,
                            "assigment added": newAssignment.assignment.eventName,
                            "course": course.courseTitle
                        } }
            return Response(data=response, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['GET'])
    def get_assignment(self, request, **extra_fields):
        if 'assignmentID' not in request.data: 
            response = {"message": "You must provide an assignmentID"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

        else:
            assignment = MyAssignments.objects.get(assignment=request.data.get('assignmentID'))
            assignmentName = CourseCalendar.objects.get(id=request.data.get('assignmentID')).eventName
            response = {
                    "message": "Success. Assignments retrieved.", 
                    "userObject":{
                    },
                    "assignmentData": {
                        "assignmentName": assignmentName,
                        "user_assignment_id": assignment.id, 
                        "doneWith": assignment.donewith,
                        "hoursTracked": assignment.hoursTracked,
                    }
                } 
            return Response(data=response, status=status.HTTP_200_OK)
         
    @action(detail=False, methods=['GET'])
    def get_assignments_course(self, request, **extra_fields):
        if 'courseID' not in request.data: 
            response = {"message": "You must provide an courseID"}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)

        else:
            userInstance = Student.objects.get(id=request.user.pk)
            myAssignments=[]
            gradAssignments = list(CourseCalendar.objects.filter(course_id=request.data.get('courseID'), grade = userInstance.yearGrade.yearGradeClass).values_list('id', flat=True))
            myAssignments.extend(gradAssignments)
            otherAssignments = list(CourseCalendar.objects.filter(course_id=request.data.get('courseID'),grade__isnull=True).values_list('id', flat=True))
            myAssignments.extend(otherAssignments)
            assignmentData =[]


            for assignment in myAssignments:
                newAssignment=CourseCalendar.objects.get(id=assignment)
                newObj ={"assignmentName": newAssignment.eventName,
                         "assignment.id": assignment }
                assignmentData.append(newObj)
            response = {
                    "message": "Success. Assignments retrieved.", 
                    "assignmentData": assignmentData
                } 
            return Response(data=response, status=status.HTTP_200_OK)
    @action(detail=False, methods=['POST'])
    def get_assignments_user_courses(self, request, **extra_fields):
        userObject = Student.objects.get(id=request.user.pk)
        coursesList =[]
        coursesIdList = list(User.objects.filter(id=request.user.pk).values_list("courses", flat=True))
        print(coursesIdList)
        assignmentData =[]
        for course in coursesIdList:
            print("course: ", course)
            courseId=int(course)
            print("courseId: ", courseId)
            coursesList.append(Course.objects.get(id=int(course)))
            myAssignments=[]
            gradAssignments = list(CourseCalendar.objects.filter(course_id=courseId, grade = userObject.yearGrade.yearGradeClass).values_list('id', "course_id"))
            myAssignments.extend(gradAssignments)
            otherAssignments = list(CourseCalendar.objects.filter(course_id=courseId,grade__isnull=True).values_list('id', "course_id"))
            myAssignments.extend(otherAssignments)
            for assignment in myAssignments:
                print("hej")
                print("assignment: ", assignment)
                print("assignment id: ", assignment[0])
                print("assignment course_id: ", assignment[1])
                newAssignment=CourseCalendar.objects.get(id=assignment[0])
                course = Course.objects.get(id=assignment[1])
                newObj ={"assignmentName": newAssignment.eventName,
                         "course": course.courseTitle,
                         "assignmentId": assignment[0] }
                assignmentData.append(newObj)
        response = {
                    "message": "Success. Assignments retrieved.", 
                    "assignmentData": assignmentData
                } 
        return Response(data=response, status=status.HTTP_200_OK)

class UserScheduleViewset(viewsets.ModelViewSet):
    queryset = UserSchedule.objects.all()
    serializer_class = UserScheduleSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
   

    @action(detail=False, methods=['POST'])
    def create_user_schedule_course(self, request, **extra_fields):
        if 'courseID' not in request.data: 
            response = {"message": "You must provide a courseID as foreinkey to create schedule"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        
        else:
            course=Course.objects.get(id=request.data.get('courseID'))
            userObject = Student.objects.get(id=request.user.pk)
            print(userObject.email)
            yearGrade = YearGrade.objects.get(yearGradeClass=userObject.yearGrade)
            print("hej")
            courseScheduleList = list(CourseSchedule.objects.filter(course=course, yearGrade=yearGrade).values_list('id', flat=True))
            eventNameList=[]
            print("courseScheduleList: ", courseScheduleList)
            for item in courseScheduleList:
                print(item)
                courseSchedule=CourseSchedule.objects.get(id=item)
                if not UserSchedule.objects.filter(user_id=request.user.pk, startDateTime=courseSchedule.eventStartTime).exists():
                    obj = UserSchedule.objects.create(user=userObject, event=courseSchedule.courseEvent, startDateTime=courseSchedule.eventStartTime,
                                                    endDateTime=courseSchedule.eventEndTime, course=course)
                                                                        
                    obj.save()
                    eventNameList.append(obj.event)
                else:
                    print("already exists")
                    continue
            
            response ={"message": "Success. Schedule created.",
                       "userObject": {
                            "user.id": userObject.id,
                            "user.email": userObject.email,
                        },
                         "scheduleObjects": {
                            "events added list": eventNameList,
                            "course": course.courseTitle,
                        },}
            return Response(data=response, status=status.HTTP_200_OK)
    
class AvailableHoursViewset(viewsets.ModelViewSet):
    queryset = AvailableHours.objects.all()
    serializer_class = AvailableHoursSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )


    @action(detail=False, methods=['POST'])
    def create_availableHours(self, request, **extra_fields):
        userObject = Student.objects.get(id=request.user.pk)
        print(userObject.email)
        deletedObj=0
        updatedObj=0
        deletedObjList =[]
        updatedObjList =[]
        #      user_courses_qs = User.objects.get(id=request.user.pk).courses.all()

        # user_courses = []
        # for course in user_courses_qs:
        #     user_courses.append(course.id)
        print("user.courses: ", userObject.courses.all())
        # if len(userObject.courses.all()) < 3:
        #     response = {"message": "You have added less than three courses, if you study three courses or more you should add them all before creating schedule"}
        #     return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        # else:   
        early = UserSchedule.objects.filter(user_id=userObject.id).values_list('startDateTime', flat=True).earliest("startDateTime")
        late = UserSchedule.objects.filter(user_id=userObject.id).values_list('startDateTime', flat=True).latest("startDateTime")
        print("late: ", late)
        print("early: ", early)
        days = pd.bdate_range(start=early.date(), end=late.date())
        print("days: ", days)
        thisYear=datetime.now().year
        holidaysList=[]
        for date in holidays.Sweden(years=int(thisYear)).items():
            if "Sunday" not in str(date[1]):
                holidaysList.append(str(date[0]))

        for date in holidaysList:
            print("date", date)
            if early.date() <= datetime.strptime(date, '%Y-%m-%d').date() <= late.date():
                days=days.drop(labels=date)
        availableHoursList =[]
        for day in days:
            print("day", day)
            newDays = UserSchedule.objects.filter(user_id=userObject.id, startDateTime__contains=day.date()).values_list('id', flat=True)
            print("newDays: ", newDays)
            freeHoursOfDay =8
            for item in newDays:
                userScheduleObject = UserSchedule.objects.get(id=item)
                startTime = userScheduleObject.startDateTime
                endTime = userScheduleObject.endDateTime
                differenceHour = endTime -startTime
                total_seconds = differenceHour.total_seconds()                # Convert timedelta into seconds
                seconds_in_hour = 60 * 60                         # Set the number of seconds in an hour
                td_in_hours = total_seconds / seconds_in_hour
                td_in_hours=round(td_in_hours+0.49) 
                print ("differenceHour: ",differenceHour)
                print("I timmar: ", td_in_hours)
                freeHoursOfDay = freeHoursOfDay - td_in_hours
                if freeHoursOfDay < 0:
                    freeHoursOfDay = 0
                print("Day: ", day.date(), " ", "freeHours: ", freeHoursOfDay)
                if freeHoursOfDay == 0:
                    print("hej")
                    if AvailableHours.objects.filter(student=userObject, theDate=day.date()).exists():
                        deletedObjList.append(AvailableHours.objects.filter(student=userObject, theDate=day.date()).values('theDate', "availableHours"))
                        AvailableHours.objects.filter(student=userObject, theDate=day.date()).delete()
                        deletedObj += 1

                    continue
                elif AvailableHours.objects.filter(student=userObject, theDate=day.date()).exists() is True:
                    print("halåå")
                    AvailableHours.objects.filter(student=userObject, theDate=day.date()).update(availableHours=freeHoursOfDay)
                    updatedObjList.append(AvailableHours.objects.filter(student=userObject, theDate=day.date()).values('theDate', "availableHours"))
                    updatedObj += 1

                    continue
                else:
                    print("hejdå")
                    obj = AvailableHours.objects.create(student=userObject, theDate=day, availableHours=freeHoursOfDay)
                    obj.save() 
                    dataObj = {"date": day,
                            "availableHours": freeHoursOfDay}
                    availableHoursList.append(dataObj)
        print("updatedObj: ", updatedObj)
        print("deletedObj: ", deletedObj)
        print("updatedObjList: ", updatedObjList)
        print("deletedObjList: ", deletedObjList)
        response ={"message": "Success. AvailableHours created.",
                    "userObject": {
                            "user.id": userObject.id,
                            "user.email": userObject.email,
                        },
                        "availableHours": availableHoursList,
                        }
        return Response(data=response, status=status.HTTP_200_OK)
            
class OptimalScheduleViewset(viewsets.ModelViewSet):
    queryset = OptimalSchedule.objects.all()
    serializer_class = OptimalScheduleSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )

    @action(detail=False, methods=['POST'])
    def create_optimal_schedule(self, request, **extra_fields):
        userObject = User.objects.get(id=request.user.pk)
        availableHoursList =list(AvailableHours.objects.filter(student=userObject.id).values("theDate", "availableHours").order_by("theDate"))
        #myAssignments = list(MyAssignments.objects.filter(student=26).values("id","assignment", "donewith"))
        myAssignmentsId = list(MyAssignments.objects.filter(student=userObject.id).values_list("assignment", flat=True))
        slotsAvailable = []
        theAssignments = list(CourseCalendar.objects.filter(id__in=myAssignmentsId).order_by( "-startDateTime","-dueTime").values("expectedHours", "eventName", "dueTime", "mandatory", "startDateTime", "course"))
        totalStudyTime =0
        for a in theAssignments:
            totalStudyTime += a["expectedHours"]
            print(a["eventName"], a["course" ])
        #print("theAssignments: ", theAssignments)
        print(availableHoursList)
        #print("test: ", availableHoursList[1]["theDate"])
        print("totalStudyTime: ", totalStudyTime)
        totalAvailableHoursLeft =0
        for item in availableHoursList:
            totalAvailableHoursLeft += item["availableHours"]
            slotsAvailable.append({"theDate": item["theDate"], "availableHours": item["availableHours"], "available": True})
        print("toatal hours left: ", totalAvailableHoursLeft)
        disregaredAssignments =[]
        thedateList =[]
        dateList =[]
        for assignment in theAssignments:
            print(assignment["eventName"])
            dateIndex= 0
            countIndex=0
            stopIndex=-1
           # print(countIndex)
            for x in slotsAvailable:
                # print("hej: ", availableHoursList)
                thisDate= x["theDate"]
                # print("thisDate: ", thisDate)
                # print("dueTime: ", theAssignments[ind]["dueTime"].date())
                if x["theDate"] < assignment["dueTime"].date():
                    #print("thisDate2: ", thisDate)
                    dateIndex =slotsAvailable.index(x,countIndex)
                    countIndex += 1
                    # print("theDate: ", x["theDate"] )
                    # print("dateIndex: ", dateIndex)
                    if assignment["startDateTime"]  is not None:
                        
                        if thisDate <= assignment["startDateTime"].date():
                            print(dateIndex)
                            stopIndex=dateIndex
                        else:
                            print("break")
                            break
                    else:
                        stopIndex=-1
                else:
                    countIndex +=1
                    #continue
            print("countIndex: ", countIndex)
            hoursLeft = assignment["expectedHours"]
            #print(stopIndex)
            
            if assignment["expectedHours"] <= totalAvailableHoursLeft:
                
                count = 0
                # print(stopIndex)
            

                for i in range(dateIndex, stopIndex, -1):
                    count += 1
                    print("count: ", count)
                    # print("assignment: ", assignment["eventName"], " range: ", availableHoursList[i]["theDate"])
                    


                    #print(availableHoursList[i])
                    # if availableHoursList[i]["availableHours"] >= assignment["expectedHours"]:
                    #    print("yes")
                    #    break
                    # else:
                    #    print("timmarna som är kvar: ", assignment["expectedHours"] -  availableHoursList[0]["availableHours"])
                    
                    if hoursLeft > 0:
                        if slotsAvailable[i]["available"] == True:
                            if slotsAvailable[i]["availableHours"] >= hoursLeft:
                                # print("if innuti if hoursLeft > 0")
                                # print("the date before assignment: ", availableHoursList[i])
                                dateList.append({"date": slotsAvailable[i]["theDate"], "hours": hoursLeft, "eventName": assignment["eventName"], "course": assignment["course"], "dueTime": assignment["dueTime"], "startDateTime": assignment["startDateTime"]})
                                slotsAvailable[i]["availableHours"] -= hoursLeft
                                hoursLeft = hoursLeft - hoursLeft
                                # print("hours left: ", hoursLeft)
                                # print ("the date after added assignment: ", availableHoursList[i])
                                # print("break, if innuti if hoursLeft > 0 ")
                                if slotsAvailable[i]["availableHours"] == 0:
                                    slotsAvailable[i]["available"]=False
                                break
                            else:
                                # print("else innuti if hoursLeft > 0")
                                # print("innan hours left: ", hoursLeft)
                                # print("hourslist: ", availableHoursList[i]["availableHours"])
                                # print("the date before assignment: ", availableHoursList[i])
                                dateList.append({"date": slotsAvailable[i]["theDate"], "hours": slotsAvailable[i]["availableHours"], "eventName": assignment["eventName"], "course": assignment["course"], "dueTime": assignment["dueTime"], "startDateTime": assignment["startDateTime"]})
                                hoursLeft = hoursLeft - slotsAvailable[i]["availableHours"]
                                slotsAvailable[i]["availableHours"]=0
                                slotsAvailable[i]["available"]=False
                                # print("dateList: ", dateList)
                                # print("hours left: ", hoursLeft)
                                #print(" availableHoursList: ", availableHoursList[
                                # print ("the date after added assignment: ", availableHoursList[i])
                            #break
                        else:
                            continue
                    #print(thedateList)
                    #print(thedateList)
                    #thedateList= thedateList + dateList
                    #print(thedateList)
                    print("else i höjd med if hoursLeft > 0")

                    #Prova nytt, ta inte bort indexerna i loopen utan spara de som ska bort senare, kanske påverkar vilka som går att använda, lista?

                    # print("konsting else")
                    # print("efter assignment hoursLeft: ", hoursLeft)
                    # print("thedateList: ", thedateList)
                    #break
                    #break
            else:
                disregaredAssignments.append(assignment)
        print("slotsAvailable: ", slotsAvailable)
        printList =[]
        thedateList= thedateList + dateList
        print("totalHoursLeft: ", totalAvailableHoursLeft)
        for j in range(len(thedateList)):

            printDate = thedateList[j]["date"]
            eventName = thedateList[j]["eventName"]
            hours = thedateList[j]["hours"]
            course =Course.objects.get(id=thedateList[j]["course"])
            duedate = thedateList[j]["dueTime"]
            startDateTime = thedateList[j]["startDateTime"]
            printList.append({"eventName": eventName, "date": str(printDate), "hours": hours, "courseTitle":course.courseTitle, "dueTime": duedate, "startDateTime": startDateTime})
            newObj = OptimalSchedule.objects.create(student =userObject, theDate = printDate, hours =hours, course =course, assignmentName = eventName)
            newObj.save()
                    
        #print("thedateList: ", thedateList)
        # print("printList: ", printList)
        print("disregaredAssignments: ", disregaredAssignments)
        response ={"message": "Success. Schedule created.",
                         "Schedule": printList,
                        }
        return Response(data=response, status=status.HTTP_200_OK)

            #Lägga till kurs och namn på uppgift till dateList?
    
    @action(detail=False, methods=['POST'])
    def get_optimal_schedule_by_date(self, request, **extra_fields):
        if 'date' not in request.data: 
            response = {"message": "You must provide a date to retrive optimal schedule"}
            return Response(response, status = status.HTTP_400_BAD_REQUEST)
        else:
            userObject = Student.objects.get(id=request.user.pk)
            optimalAssignmentsList =[]
            coursesIdList = list(User.objects.filter(id=request.user.pk).values_list("courses", flat=True))
            print(coursesIdList)
            assignmentData =[]
            for course in coursesIdList:
                thisCourse =Course.objects.get(id=int(course))
                optimalAssignmentsIdList = list(OptimalSchedule.objects.filter(student=userObject, theDate=request.data.get('date'), course=thisCourse).values_list("id", flat=True))
                print("optimalAssignmentsIdList: ", optimalAssignmentsIdList)
                assignmentData =[]
                courseStr=""
                for assignment in optimalAssignmentsIdList:
                    optimalAssignment = OptimalSchedule.objects.get(id=assignment)
                    optimalAssignmentObj ={"assignmentName": optimalAssignment.assignmentName, "hours": optimalAssignment.hours}
                    assignmentData.append(optimalAssignmentObj)
                    courseStr= optimalAssignment.course.courseTitle
                if assignmentData != []:
                    courseAssignmentObj={courseStr : assignmentData}
                else:
                    continue
                optimalAssignmentsList.append(courseAssignmentObj)    
            response = {
                        "message": "Success. Optimal Schedule retrieved.", 
                        "optimalAssignmentsList": optimalAssignmentsList
                    } 
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

