"""
URL configuration for timetracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework.authtoken.views import obtain_auth_token
from api import views
from django.contrib.auth import views as auth_views
#from . import accounts

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('auth/', obtain_auth_token),
    #path("accounts/", include("django.contrib.auth.urls")),

    
    #path("accounts/", include("django.contrib.auth.urls")),

    #path("password_change/", views.password_change, name="password_change"),
    #path("accounts/", include("django.contrib.auth.urls")),
    
    path('auth/login/', views.LoginView.as_view(), name="login"),
    #path('accounts/login/', auth_views.LoginView.as_view(), name="login"),
    
    #path('auth/logout/', views.LogoutView.as_view(), name="logout"),
    #path('accounts/logout/', auth_views.LogoutView.as_view(), name="logout"),
    
    #path('auth/password/', views.PasswordChangeView.as_view()),
    #path('auth/password/', auth_views.PasswordChangeView.as_view()),

]
