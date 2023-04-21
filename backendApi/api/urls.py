from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import CourseViewset, ProgrammeViewset, UserViewset, StudentViewset

router = routers.DefaultRouter()
router.register("courses", CourseViewset)
router.register("programmes", ProgrammeViewset)
# router.register("courseEvaluations", CourseEvaluationViewset)
router.register("users", UserViewset)
router.register("students", StudentViewset)
#router.register("login", LoginView)


urlpatterns = [
    path('', include(router.urls))
]
