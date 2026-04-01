from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsTransporter
from apps.logistics.models import Shipment
from apps.logistics.serializers import MissionSerializer, MissionStatusSerializer
from apps.users.models import Transporter


class DeliveryRequestsView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsTransporter]

    def get_queryset(self):
        return Shipment.objects.filter(status=Shipment.Status.PENDING).select_related(
            "order",
            "order__buyer__person",
            "order__farmer__person",
            "transporter",
            "transporter__person",
        )


class ActiveDeliveriesView(generics.ListAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsTransporter]

    def get_queryset(self):
        transporter = getattr(self.request.user, "transporter", None)
        if not transporter:
            return Shipment.objects.none()

        return Shipment.objects.filter(
            transporter=transporter,
            status__in=[Shipment.Status.ACCEPTED, Shipment.Status.PICKED_UP, Shipment.Status.IN_TRANSIT],
        ).select_related("order", "order__buyer__person", "order__farmer__person", "transporter", "transporter__person")


class DeliveryByIdView(generics.RetrieveAPIView):
    serializer_class = MissionSerializer
    permission_classes = [IsTransporter]
    lookup_field = "tracking_number"
    lookup_url_kwarg = "mission_id"
    queryset = Shipment.objects.all().select_related(
        "order",
        "order__buyer__person",
        "order__farmer__person",
        "transporter",
        "transporter__person",
    )


class AcceptMissionView(APIView):
    permission_classes = [IsTransporter]

    def post(self, request, mission_id):
        shipment = Shipment.objects.filter(tracking_number=mission_id).first()
        if not shipment:
            return Response({"detail": "Mission not found."}, status=status.HTTP_404_NOT_FOUND)

        transporter = getattr(request.user, "transporter", None)
        if not transporter:
            transporter = Transporter.objects.create(person=request.user)

        shipment.transporter = transporter
        shipment.status = Shipment.Status.ACCEPTED
        shipment.save(update_fields=["transporter", "status"])
        return Response(MissionSerializer(shipment).data)


class DeclineMissionView(APIView):
    permission_classes = [IsTransporter]

    def post(self, request, mission_id):
        shipment = Shipment.objects.filter(tracking_number=mission_id).first()
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

        shipment = Shipment.objects.filter(tracking_number=mission_id, transporter=transporter).first()
        if not shipment:
            return Response({"detail": "Mission not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = MissionStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        shipment.status = serializer.get_status_code()
        shipment.save(update_fields=["status"])
        return Response(MissionSerializer(shipment).data)
