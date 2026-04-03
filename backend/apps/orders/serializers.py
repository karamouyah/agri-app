from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.catalog.models import ProductList
from apps.logistics.models import Shipment
from apps.orders.models import Order, OrderItem, Payment


ORDER_STATUS_SLUGS = {
    Order.Status.PENDING: "pending",
    Order.Status.ACCEPTED: "accepted",
    Order.Status.DECLINED: "declined",
    Order.Status.SHIPPED: "shipped",
    Order.Status.IN_TRANSIT: "in transit",
    Order.Status.DELIVERED: "delivered",
}

ORDER_STATUS_CODES = {value: key for key, value in ORDER_STATUS_SLUGS.items()}


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product_list.id", read_only=True)
    name = serializers.CharField(source="product_list.product.name", read_only=True)
    unit_price = serializers.IntegerField(source="price", read_only=True)
    currency = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["product_id", "name", "quantity", "unit_price", "currency"]

    def get_currency(self, _obj):
        return "DZD"


class OrderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    address = serializers.CharField(source="delivery_address", read_only=True)
    payment_method = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    estimated_delivery = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source="order_date", read_only=True)
    total = serializers.IntegerField(source="total_amount", read_only=True)
    currency = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "address",
            "payment_method",
            "status",
            "estimated_delivery",
            "created_at",
            "total",
            "currency",
            "items",
        ]

    def get_payment_method(self, obj):
        payment = obj.payments.order_by("id").first()
        return payment.payment_method if payment else "cash_on_delivery"

    def get_status(self, obj):
        return ORDER_STATUS_SLUGS.get(obj.status, "pending")

    def get_estimated_delivery(self, obj):
        shipment = obj.shipments.order_by("id").first()
        if shipment and shipment.estimated_delivery_date:
            return shipment.estimated_delivery_date.date()
        return None

    def get_currency(self, _obj):
        return "DZD"


class CheckoutItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    items = CheckoutItemInputSerializer(many=True)
    address = serializers.CharField(max_length=255)
    payment_method = serializers.CharField(max_length=100)

    @transaction.atomic
    def create(self, validated_data):
        buyer_user = self.context["request"].user
        buyer = getattr(buyer_user, "buyer", None)
        if not buyer:
            raise serializers.ValidationError("Only buyers can place orders.")

        item_inputs = validated_data["items"]
        listings = {
            listing.id: listing
            for listing in ProductList.objects.select_related("product", "farmer", "farmer__person").filter(
                id__in=[item["product_id"] for item in item_inputs]
            )
        }

        if len(listings) != len(item_inputs):
            raise serializers.ValidationError("One or more products do not exist.")

        farmer_ids = {listings[item["product_id"]].farmer_id for item in item_inputs}
        if len(farmer_ids) != 1:
            raise serializers.ValidationError("Checkout supports one farmer per order.")

        farmer = next(iter(listings.values())).farmer
        farm = farmer.farms.order_by("id").first()
        pickup_address = farm.location if farm else "Farmer pickup address not set"

        order = Order.objects.create(
            buyer=buyer,
            farmer=farmer,
            delivery_address=validated_data["address"],
            pickup_address=pickup_address,
            status=Order.Status.PENDING,
            total_amount=0,
        )

        total = 0
        for item in item_inputs:
            listing = listings[item["product_id"]]
            quantity = item["quantity"]
            if listing.quantity < quantity:
                raise serializers.ValidationError(f"Insufficient stock for product {listing.product.name}.")

            line_total = quantity * listing.price
            total += line_total

            listing.quantity -= quantity
            listing.save(update_fields=["quantity"])

            OrderItem.objects.create(
                order=order,
                product_list=listing,
                quantity=quantity,
                price=listing.price,
                total_items_price=line_total,
            )

        order.total_amount = total
        order.save(update_fields=["total_amount"])

        Payment.objects.create(
            order=order,
            amount=total,
            payment_method=validated_data["payment_method"],
        )

        Shipment.objects.create(
            order=order,
            tracking_number=f"SHIP-{order.id:06d}",
            status=Shipment.Status.PENDING,
            shipping_fee=0,
            pickup_date=timezone.now(),
            estimated_delivery_date=timezone.now() + timedelta(days=3),
        )

        return order


class InvoiceSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    order_id = serializers.CharField(source="order.id", read_only=True)
    date = serializers.DateTimeField(source="transaction_date", read_only=True)
    details = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ["id", "order_id", "date", "amount", "currency", "details"]

    def get_id(self, obj):
        return f"PAY-{obj.id}"

    def get_details(self, obj):
        return f"Payment method: {obj.payment_method}"

    def get_currency(self, _obj):
        return "DZD"


class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=sorted(ORDER_STATUS_CODES.keys()))

    def get_status_code(self):
        status_slug = self.validated_data["status"]
        return ORDER_STATUS_CODES[status_slug]
