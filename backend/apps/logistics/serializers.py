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
    pickup_location = serializers.SerializerMethodField(read_only=True)
    delivery_location = serializers.SerializerMethodField(read_only=True)
    deadline = serializers.SerializerMethodField(read_only=True)
    shipping_fee = serializers.IntegerField(read_only=True)
    completed_at = serializers.SerializerMethodField(read_only=True)
    buyer_contact = serializers.CharField(source="order.buyer.person.phone_number", read_only=True)
    farmer_contact = serializers.CharField(source="order.farmer.person.phone_number", read_only=True)
    status = serializers.SerializerMethodField(read_only=True)
    load_kg = serializers.SerializerMethodField(read_only=True)
    pickup_wilaya_id = serializers.IntegerField(source="order.pickup_wilaya_id", read_only=True)
    pickup_wilaya_name = serializers.CharField(source="order.pickup_wilaya.name", read_only=True)
    pickup_commune_id = serializers.IntegerField(source="order.pickup_commune_id", read_only=True)
    pickup_commune_name = serializers.CharField(source="order.pickup_commune.name", read_only=True)
    delivery_wilaya_id = serializers.IntegerField(source="order.delivery_wilaya_id", read_only=True)
    delivery_wilaya_name = serializers.CharField(source="order.delivery_wilaya.name", read_only=True)
    delivery_commune_id = serializers.IntegerField(source="order.delivery_commune_id", read_only=True)
    delivery_commune_name = serializers.CharField(source="order.delivery_commune.name", read_only=True)

    class Meta:
        model = Shipment
        fields = [
            "id",
            "order_id",
            "pickup_location",
            "delivery_location",
            "pickup_wilaya_id",
            "pickup_wilaya_name",
            "pickup_commune_id",
            "pickup_commune_name",
            "delivery_wilaya_id",
            "delivery_wilaya_name",
            "delivery_commune_id",
            "delivery_commune_name",
            "deadline",
            "shipping_fee",
            "load_kg",
            "completed_at",
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

    def get_completed_at(self, obj):
        if obj.actual_delivery_date:
            return obj.actual_delivery_date.date()
        return None

    def get_pickup_location(self, obj):
        if obj.order.pickup_commune and obj.order.pickup_wilaya:
            return f"{obj.order.pickup_commune.name}, {obj.order.pickup_wilaya.name}"
        return obj.order.pickup_address

    def get_delivery_location(self, obj):
        if obj.order.delivery_commune and obj.order.delivery_wilaya:
            return f"{obj.order.delivery_commune.name}, {obj.order.delivery_wilaya.name}"
        return obj.order.delivery_address

    def get_load_kg(self, obj):
        return sum(item.quantity for item in obj.order.items.all())

    def get_status(self, obj):
        return SHIPMENT_STATUS_SLUGS.get(obj.status, "pending")


class MissionStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=sorted(SHIPMENT_STATUS_CODES.keys()))

    def get_status_code(self):
        return SHIPMENT_STATUS_CODES[self.validated_data["status"]]
