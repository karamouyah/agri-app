from django.urls import path

from apps.locations.views import CommuneListView, ValidateLocationView, WilayaListView, WilayaTreeView

urlpatterns = [
    path("wilayas/", WilayaListView.as_view(), name="location-wilayas"),
    path("communes/", CommuneListView.as_view(), name="location-communes"),
    path("tree/", WilayaTreeView.as_view(), name="location-tree"),
    path("validate/", ValidateLocationView.as_view(), name="location-validate"),
]

