from django.test import TestCase
from django.db import models
#from .views import UserScheduleViewset
from .models import Course, Student, OptimalSchedule, User #YearGrade, CourseSchedule, UserSchedule #AvailableHours, User, MyAssignments, CourseCalendar, Course
import pandas
import holidays
print(holidays.__version__)

# Create your tests here.

import pandas as pd
import numpy as np
from datetime import date, datetime, timedelta

class TestClass(TestCase):
   userObject = Student.objects.get(id=33)
   coursesList =[]
   coursesIdList = list(User.objects.filter(id=33).values_list("courses", flat=True))
   print(coursesIdList)
   optimalAssignmentsList =[]
   for course in coursesIdList:
      thisCourse =Course.objects.get(id=int(course))
      optimalAssignmentsIdList = list(OptimalSchedule.objects.filter(student=userObject, theDate=datetime.strptime('2023-04-25', "%Y-%m-%d").date(), course=thisCourse).values_list("id", flat=True))
      print("optimalAssignmentsIdList: ", optimalAssignmentsIdList)
      assignmentData =[]
      courseStr=""
      for assignment in optimalAssignmentsIdList:
         optimalAssignment = OptimalSchedule.objects.get(id=assignment)
         optimalAssignmentObj ={"assignmentName": optimalAssignment.assignmentName, "hours": optimalAssignment.hours}
         assignmentData.append(optimalAssignmentObj)
         courseStr= optimalAssignment.course.courseTitle
      if assignmentData != []:
         for item in assignmentData:
            courseAssignmentObj={courseStr : item}
      else:
         continue
      optimalAssignmentsList.append(courseAssignmentObj)
   print("optimalAssignmentsList: ", optimalAssignmentsList)
         
      
      
      
      
      
      # myAssignments=[]
      # gradAssignments = list(CourseCalendar.objects.filter(course_id=courseId, grade = userObject.yearGrade.yearGradeClass).values_list('id', "course_id"))
      # myAssignments.extend(gradAssignments)
      # otherAssignments = list(CourseCalendar.objects.filter(course_id=courseId,grade__isnull=True).values_list('id', "course_id"))
      # myAssignments.extend(otherAssignments)
      # for assignment in myAssignments:
      #    print("hej")
      #    print("assignment: ", assignment)
      #    print("assignment id: ", assignment[0])
      #    print("assignment course_id: ", assignment[1])
      #    newAssignment=CourseCalendar.objects.get(id=assignment[0])
      #    course = Course.objects.get(id=assignment[1])
      #    newObj ={"assignmentName": newAssignment.eventName,
      #             "course": course.courseTitle,
      #             "assignment.id": assignment[0] }
      #    assignmentData.append(newObj)
      # response = {
      #             "message": "Success. Assignments retrieved.", 
      #             "assignmentData": assignmentData
      #          }
      # print(response)

   
   
   
   # course=Course.objects.get(id=18)
   # userObject = Student.objects.get(id=26)
   # print(userObject.email)
   # yearGrade = YearGrade.objects.get(yearGradeClass=userObject.yearGrade)
   # print("hej")
   # courseScheduleList = list(CourseSchedule.objects.filter(course=course, yearGrade=yearGrade).values_list('id', flat=True))
   # eventNameList=[]
   # print("courseScheduleList: ", courseScheduleList)
   # for item in courseScheduleList:
   #    print(item)
   #    courseSchedule=CourseSchedule.objects.get(id=item)
   #    if not UserSchedule.objects.filter(user_id=26, startDateTime=courseSchedule.eventStartTime).exists():
   #       obj = UserSchedule.objects.create(user=userObject, event=courseSchedule.courseEvent, startDateTime=courseSchedule.eventStartTime,
   #                                        endDateTime=courseSchedule.eventEndTime, course=course)
   #    else:
   #          print("already exists")
   #          continue
   # print("thisYear: ", datetime.now().year)
    
   # availableHoursList =list(AvailableHours.objects.filter(student=26).values("theDate", "availableHours"))
   # myAssignments = list(MyAssignments.objects.filter(student=26).values("id","assignment", "donewith"))
   # myAssignmentsId = list(MyAssignments.objects.filter(student=26).values_list("assignment", flat=True))
   # slotsAvailable = []
   # theAssignments = list(CourseCalendar.objects.filter(id__in=myAssignmentsId).order_by("-dueTime").values("expectedHours", "eventName", "dueTime", "mandatory", "startDateTime", "course"))
   # #print("theAssignments: ", theAssignments)
   # #print(availableHoursList)
   # #print("test: ", availableHoursList[1]["theDate"])
   # userObject = User.objects.get(id=26)
   # totalAvailableHoursLeft =0
   # for item in availableHoursList:
   #    totalAvailableHoursLeft += item["availableHours"]
   #    if item["availableHours"] == 0:
   #       availableHoursList.remove(item)
   # print("toatal hours left: ", totalAvailableHoursLeft)
   # disregaredAssignments =[]
   # thedateList =[]
   # for assignment in theAssignments:
   #    dateIndex= 0
   #    countIndex=0
   #    for x in availableHoursList:
   #       thisDate= x["theDate"]
   #       if thisDate < assignment["dueTime"].date():
   #          dateIndex =availableHoursList.index(x,countIndex)
   #          countIndex += 1
   #          print("theDate: ", x["theDate"] )
   #          print("dateIndex: ", dateIndex)
   #          if assignment["startDateTime"]  is not None:
   #             if thisDate >= assignment["startDateTime"].date():
   #                stopIndex=dateIndex
   #             else:
   #                break
   #          else:
   #             stopIndex=-1
   #    hoursLeft = assignment["expectedHours"]
     
   #    if assignment["expectedHours"] <= totalAvailableHoursLeft:
   #       dateList =[]
   #       count = 0
      

   #       for i in range(dateIndex, stopIndex, -1):
   #          count += 1
   #          print("count: ", count)
            


   #          #print(availableHoursList[i])
   #          # if availableHoursList[i]["availableHours"] >= assignment["expectedHours"]:
   #          #    print("yes")
   #          #    break
   #          # else:
   #          #    print("timmarna som är kvar: ", assignment["expectedHours"] -  availableHoursList[0]["availableHours"])
            
   #          if hoursLeft > 0:
   #             #print("assignment: ", assignment["expectedHours"])
   #             if availableHoursList[i]["availableHours"] >= hoursLeft:
   #                print("if innuti if hoursLeft > 0")
   #                print("the date before assignment: ", availableHoursList[i])
   #                dateList.append({"date": availableHoursList[i]["theDate"], "hours": assignment["expectedHours"], "eventName": assignment["eventName"], "course": assignment["course"] })
   #                availableHoursList[i]["availableHours"] -= hoursLeft
   #                hoursLeft = hoursLeft - hoursLeft
   #                # print("hours left: ", hoursLeft)
   #                print ("the date after added assignment: ", availableHoursList[i])
   #                print("break, if innuti if hoursLeft > 0 ")
   #                if item["availableHours"] == 0:
   #                   del(availableHoursList[i])
   #                break
   #             else:
   #                print("else innuti if hoursLeft > 0")
   #                print("innan hours left: ", hoursLeft)
   #                print("hourslist: ", availableHoursList[i]["availableHours"])
   #                # print("the date before assignment: ", availableHoursList[i])
   #                dateList.append({"date": availableHoursList[i]["theDate"], "hours": availableHoursList[i]["availableHours"], "eventName": assignment["eventName"], "course": assignment["course"]})
   #                hoursLeft = hoursLeft - availableHoursList[i]["availableHours"]
   #                availableHoursList[i]["availableHours"]=0
   #                # print("dateList: ", dateList)
   #                print("hours left: ", hoursLeft)
   #                #print(" availableHoursList: ", availableHoursList[i])
   #                del(availableHoursList[i])
   #                # print ("the date after added assignment: ", availableHoursList[i])
   #          #break
   #             #print(thedateList)
   #             #print(thedateList)
   #             thedateList= thedateList + dateList
   #             #print(thedateList)
   #             print("else i höjd med if hoursLeft > 0")

   #             # print("konsting else")
   #             # print("efter assignment hoursLeft: ", hoursLeft)
   #             # print("thedateList: ", thedateList)
   #             #break
   #          #break
   #    else:
   #       disregaredAssignments.append(assignment)
   #    printList =[]
   #    for j in range(len(thedateList)):
   #       printDate = thedateList[j]["date"]
   #       eventName = thedateList[j]["eventName"]
   #       hours = thedateList[j]["hours"]
   #       course =Course.objects.get(id=thedateList[j]["course"])
   #       printList.append([eventName, str(printDate), hours, course.courseTitle])
         
   # #print("thedateList: ", thedateList)
   # print("printList: ", printList)
   # print("disregaredAssignments: ", disregaredAssignments)
   #    #Lägga till kurs och namn på uppgift till dateList?
         
         




# class newTest (TestCase):
#     # Select country
#    uk_holidays = holidays.Sweden(years=2023)
#    #print("year: ", date.today().year)
#    holidaysList=[]
#    # Print all the holidays in UnitedKingdom in year 2018
#    sweden_holidays = holidays.Sweden(years=int(date.today().year))
#    for date in holidays.Sweden(years=int(date.today().year)).items():
#       #print("holiday: ", str(date[1]))
#       if "Sunday" not in str(date[1]):
#          holidaysList.append(str(date[0]))
#          print("date: ", str(date[0]))

#    #print(holidaysList)
#    startTime = datetime(2023, 3, 20, 13, 15, 00)
#    endTime = datetime(2023, 3, 20, 15, 00, 00)
#    newV= endTime - startTime
#   # print("tidsskillnad. ", newV)
#    early = UserSchedule.objects.filter(user_id=26).values_list('startDateTime', flat=True).earliest("startDateTime")
#    late = UserSchedule.objects.filter(user_id=26).values_list('startDateTime', flat=True).latest("startDateTime")
#    #print("late: ", late)
#    #print("early: ", early)
#    days = pandas.bdate_range(start=early.date(), end=late.date())
#    for date in holidaysList:
#     # print("date", date)
#      if early.date() <= datetime.strptime(date, '%Y-%m-%d').date() <= late.date():
#         days=days.drop(labels=date)
#    for day in days:
#       newDays = UserSchedule.objects.filter(user_id=26, startDateTime__contains=day.date()).values_list('id', flat=True)
#       freeHoursOfDay =8
#       for item in newDays:
#          userScheduleObject = UserSchedule.objects.get(id=item)
#          startTime = userScheduleObject.startDateTime
#          endTime = userScheduleObject.endDateTime
#          differenceHour = endTime -startTime
#          total_seconds = differenceHour.total_seconds()                # Convert timedelta into seconds
#          seconds_in_hour = 60 * 60                         # Set the number of seconds in an hour
#          td_in_hours = total_seconds / seconds_in_hour
#          td_in_hours=round(td_in_hours+0.49) 
#          # if differenceHour.minutes == '00':
#          #    print("hej")
#          #    differenceHour =differenceHour.replace(second=0, minute=0)
#          # # if differenceHour < 0:
#          # #    differenceHour=0
#          #print ("differenceHour: ",differenceHour)
#          #print("I timmar: ", td_in_hours)
#          freeHoursOfDay = freeHoursOfDay - td_in_hours
#          if freeHoursOfDay < 0:
#             freeHoursOfDay = 0
#          #print("Day: ", day.date(), " ", "freeHours: ", freeHoursOfDay)
      



         
         


   

# class printTestFiles (TestCase):
#    print("hej")
#    df=pd.read_excel("C:/Users\PC\Downloads\TimeEdit_2023-05-02_16_40.xls",skiprows=5) #, usecols=["Slutdatum"])
#    #print(df[df["Program"] == 'STS2'].head())
#    pColum=df[df['Program'].str.contains('STS2', na=False)]
#    klass = pColum[df['Program'] != 'STS2.B']
#    klassA = klass[df['Program'] != 'STS2.C']

# #    print("The dataframe is:")
#    #print(df)
#    print(klassA)
  

# class ExcelFile (TestCase):
#    file = models.FileField(upload_to="uploads")

   
# def upload_file(request):
#     if request.method == "POST":
#         form = ModelFormWithFileField(request.POST, request.FILES)
#         if form.is_valid():
#             # file is saved
#             form.save()
#             return HttpResponseRedirect("/success/url/")
#     else:
#         form = ModelFormWithFileField()
#     return render(request, "upload.html", {"form": form})


