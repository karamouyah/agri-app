from rest_framework import serializers

from apps.logistics.models import Shipment


SHIPMENT_STATUS_SLUGS = {
    Shipment.Status.PENDING: "pending",
    Shipment.Status.ACCEPTED: "accepted",
    Shipment.Status.DECLINED: "declined",
    Shipment.Status.PICKED_UP: "picked up",
    Shipment.Status.IN_TRANSIT: "in transit",
    Shipment.Status.DELIVERED: "delivered",
}

SHIPMENT_STATUS_CODES = {value: key for key, value in SHIPMENT_STATUS_SLUGS.items()}


class MissionSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField(read_only=True)
    order_id = serializers.CharField(source="order.id", read_only=True)
    pickup_location = serializers.CharField(source="order.pickup_address", read_only=True)
    delivery_location = serializers.CharField(source="order.delivery_address", read_only=True)
    deadline = serializers.SerializerMethodField(read_only=True)
    buyer_contact = serializers.CharField(source="order.buyer.person.phone_number", read_only=True)
    farmer_contact = serializers.CharField(source="order.farmer.person.phone_number", read_only=True)
    status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Shipment
        fields = [
            "id",
            "order_id",
            "pickup_location",
            "delivery_location",
            "deadline",
            "buyer_contact",
            "farmer_contact",
            "status",
        ]

    def get_id(self, obj):
        return obj.tracking_number or f"SHIP-{obj.id:06d}"

    def get_deadline(self, obj):
        if obj.estimated_delivery_date:
            return obj.estimated_delivery_date.date()
        return None

    def get_status(self, obj):
        return SHIPMENT_STATUS_SLUGS.get(obj.status, "pending")


class MissionStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=sorted(SHIPMENT_STATUS_CODES.keys()))

    def get_status_code(self):
        return SHIPMENT_STATUS_CODES[self.validated_data["status"]]
