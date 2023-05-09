from django.test import TestCase
from django.db import models

# Create your tests here.

import pandas as pd
import numpy as np

class printTestFiles (TestCase):
   print("hej")
   df=pd.read_excel("C:/Users\PC\Downloads\TimeEdit_2023-05-02_16_40.xls",skiprows=5) #, usecols=["Slutdatum"])
   #print(df[df["Program"] == 'STS2'].head())
   pColum=df[df['Program'].str.contains('STS2', na=False)]
   klass = pColum[df['Program'] != 'STS2.B']
   klassA = klass[df['Program'] != 'STS2.C']

#    print("The dataframe is:")
   #print(df)
   print(klassA)
  

class ExcelFile (TestCase):
   file = models.FileField(upload_to="uploads")

   
def upload_file(request):
    if request.method == "POST":
        form = ModelFormWithFileField(request.POST, request.FILES)
        if form.is_valid():
            # file is saved
            form.save()
            return HttpResponseRedirect("/success/url/")
    else:
        form = ModelFormWithFileField()
    return render(request, "upload.html", {"form": form})


