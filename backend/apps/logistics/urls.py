from django.urls import path

from apps.logistics.views import (
    AcceptMissionView,
    ActiveDeliveriesView,
    DeclineMissionView,
    DeliveryByIdView,
    DeliveryRequestsView,
    UpdateDeliveryStatusView,
)

urlpatterns = [
    path("requests/", DeliveryRequestsView.as_view(), name="delivery-requests"),
    path("active/", ActiveDeliveriesView.as_view(), name="active-deliveries"),
    path("missions/<str:mission_id>/", DeliveryByIdView.as_view(), name="delivery-by-id"),
    path("missions/<str:mission_id>/accept/", AcceptMissionView.as_view(), name="accept-mission"),
    path("missions/<str:mission_id>/decline/", DeclineMissionView.as_view(), name="decline-mission"),
    path("missions/<str:mission_id>/status/", UpdateDeliveryStatusView.as_view(), name="mission-status"),
]
