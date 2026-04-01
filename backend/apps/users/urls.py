from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.users.views import (
    AdminUserViewSet,
    CurrentUserView,
    FarmProfileView,
    GenerateReportView,
    LoginView,
    NationalStatsView,
    RefreshView,
    RegisterView,
)

router = DefaultRouter()
router.register("admin/users", AdminUserViewSet, basename="admin-users")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="token-refresh"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("farmer/profile/", FarmProfileView.as_view(), name="farmer-profile"),
    path("admin/stats/", NationalStatsView.as_view(), name="national-stats"),
    path("admin/reports/", GenerateReportView.as_view(), name="generate-report"),
    path("", include(router.urls)),
]
