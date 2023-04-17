from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import CourseViewset

router = routers.DefaultRouter()
router.register("courses", CourseViewset)
# router.register("courseEvaluations", CourseEvaluationViewset)
# router.register("users", UserViewset)


urlpatterns = [
    path('', include(router.urls)),
]