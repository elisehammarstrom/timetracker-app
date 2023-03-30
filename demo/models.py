from django.db import models

# Create your models here.

class Programme(models.Model):
    program_code = models.CharField(max_length=36)
    
    # program_title = models.CharField(max_length=100)
