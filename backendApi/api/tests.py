from django.test import TestCase
from django.db import models
from .views import UserScheduleViewset
from .models import UserSchedule
import pandas

# Create your tests here.

import pandas as pd
import numpy as np
from datetime import date, datetime, timedelta
class newTest (TestCase):
   startTime = datetime(2023, 3, 20, 13, 15, 00)
   endTime = datetime(2023, 3, 20, 15, 00, 00)
   newV= endTime - startTime
   print("tidsskillnad. ", newV)
   early = UserSchedule.objects.filter(user_id=26).values_list('startDateTime', flat=True).earliest("startDateTime")
   late = UserSchedule.objects.filter(user_id=26).values_list('startDateTime', flat=True).latest("startDateTime")
   print("late: ", late)
   print("early: ", early)
   days = pandas.bdate_range(start=early.date(), end=late.date())
   print("days: ", days)
   for day in days:
      print("day", day)
      newDays = UserSchedule.objects.filter(user_id=26, startDateTime__contains=day.date()).values_list('id', flat=True)
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
         # if differenceHour.minutes == '00':
         #    print("hej")
         #    differenceHour =differenceHour.replace(second=0, minute=0)
         # # if differenceHour < 0:
         # #    differenceHour=0
         print ("differenceHour: ",differenceHour)
         print("I timmar: ", td_in_hours)
         freeHoursOfDay = freeHoursOfDay - td_in_hours
         if freeHoursOfDay < 0:
            freeHoursOfDay = 0
         print("Day: ", day.date(), " ", "freeHours: ", freeHoursOfDay)
      



         
         


   

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


