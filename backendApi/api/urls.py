from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from .views import CourseViewset, ProgrammeViewset, UserViewset, StudentViewset, UserCourseTrackingViewset, CourseCalendarViewset, UserFreetimeViewset, CourseScheduleViewset, YearGradeViewset, CourseEvaluationViewset, QuestionAnswerViewset, MyAssignmentsViewset, UserScheduleViewset
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register("courses", CourseViewset)
router.register("programmes", ProgrammeViewset)
router.register("evaluate", CourseEvaluationViewset)
#router.register("evaluate/question", QuestionAnswerViewset)
router.register("users", UserViewset)
router.register("students", StudentViewset)
router.register("tracking", UserCourseTrackingViewset)
#router.register("login", LoginView)
router.register("courseCalendar", CourseCalendarViewset)
router.register("userFreetime", UserFreetimeViewset)
router.register("courseSchedule", CourseScheduleViewset)
router.register("yearGrade", YearGradeViewset)
router.register("myAssignments", MyAssignmentsViewset)
router.register("userSchedule", UserScheduleViewset)


urlpatterns = [
    path('', include(router.urls))
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
