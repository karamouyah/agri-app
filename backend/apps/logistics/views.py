from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsTransporter
from apps.logistics.models import Shipment
from apps.logistics.serializers import MissionSerializer, MissionStatusSerializer
from apps.users.models import Transporter


def mission_queryset():
    return Shipment.objects.select_related(
        "order",
        "order__buyer__person",
        "order__farmer__person",
        "order__pickup_wilaya",
        "order__pickup_commune",
        "order__delivery_wilaya",
        "order__delivery_commune",
        "transporter",
        "transporter__person",
    ).prefetch_related("order__items")


def eligible_shipments_for_transporter(transporter):
    if not transporter or not transporter.max_load_kg:
        return Shipment.objects.none()

    delivery_wilaya_ids = list(transporter.delivery_wilayas.values_list("id", flat=True))
    if not delivery_wilaya_ids:
        return Shipment.objects.none()

    return (
        mission_queryset()
        .filter(status=Shipment.Status.PENDING, order__delivery_wilaya_id__in=delivery_wilaya_ids)
        .annotate(load_kg=Sum("order__items__quantity"))
        .filter(load_kg__lte=transporter.max_load_kg)
    )


class DeliveryRequestsView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsTransporter]

    def get_queryset(self):
        return eligible_shipments_for_transporter(getattr(self.request.user, "transporter", None))


class ActiveDeliveriesView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsTransporter]

    def get_queryset(self):
        transporter = getattr(self.request.user, "transporter", None)
        if not transporter:
            return Shipment.objects.none()

        return mission_queryset().filter(
            transporter=transporter,
            status__in=[Shipment.Status.ACCEPTED, Shipment.Status.PICKED_UP, Shipment.Status.IN_TRANSIT],
        )


class CompletedDeliveriesView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsTransporter]

    def get_queryset(self):
        transporter = getattr(self.request.user, "transporter", None)
        if not transporter:
            return Shipment.objects.none()

        return mission_queryset().filter(
            transporter=transporter,
            status=Shipment.Status.DELIVERED,
        ).order_by("-actual_delivery_date", "-id")


class DeliveryByIdView(generics.RetrieveAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsTransporter]
    lookup_field = "tracking_number"
    lookup_url_kwarg = "mission_id"
    queryset = mission_queryset()


class AcceptMissionView(APIView):
    permission_classes = [IsTransporter]

    def post(self, request, mission_id):
        shipment = mission_queryset().filter(tracking_number=mission_id).first()
        if not shipment:
            return Response({"detail": "Mission not found."}, status=status.HTTP_404_NOT_FOUND)

        transporter = getattr(request.user, "transporter", None)
        if not transporter:
            transporter = Transporter.objects.create(person=request.user)

        if shipment.status != Shipment.Status.PENDING:
            return Response({"detail": "This mission is no longer available."}, status=status.HTTP_400_BAD_REQUEST)

        if not eligible_shipments_for_transporter(transporter).filter(id=shipment.id).exists():
            return Response(
                {
                    "detail": (
                        "This mission is outside your delivery wilayas or exceeds your maximum load capacity."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        shipment.transporter = transporter
        shipment.status = Shipment.Status.ACCEPTED
        shipment.save(update_fields=["transporter", "status"])
        return Response(MissionSerializer(shipment).data)


class DeclineMissionView(APIView):
    permission_classes = [IsTransporter]

    def post(self, request, mission_id):
        shipment = mission_queryset().filter(tracking_number=mission_id).first()
        if not shipment:
            return Response({"detail": "Mission not found."}, status=status.HTTP_404_NOT_FOUND)
        shipment.status = Shipment.Status.DECLINED
        shipment.save(update_fields=["status"])
        return Response(MissionSerializer(shipment).data)


class UpdateDeliveryStatusView(APIView):
    permission_classes = [IsTransporter]

    def patch(self, request, mission_id):
        transporter = getattr(request.user, "transporter", None)
        if not transporter:
            return Response({"detail": "Mission not found."}, status=status.HTTP_404_NOT_FOUND)

        shipment = mission_queryset().filter(tracking_number=mission_id, transporter=transporter).first()
        if not shipment:
            return Response({"detail": "Mission not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = MissionStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        shipment.status = serializer.get_status_code()
        shipment.save(update_fields=["status"])
        return Response(MissionSerializer(shipment).data)
