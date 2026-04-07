from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsBuyer
from apps.orders.models import Order, Payment
from apps.orders.serializers import (
    CheckoutSerializer,
    InvoiceSerializer,
    OrderSerializer,
    OrderStatusUpdateSerializer,
)
from apps.users.models import User


class CheckoutView(generics.CreateAPIView):
    serializer_class = CheckoutSerializer
    permission_classes = [IsBuyer]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base = Order.objects.select_related(
            "delivery_wilaya",
            "delivery_commune",
            "pickup_wilaya",
            "pickup_commune",
        ).prefetch_related("items", "items__product_list", "payments", "shipments")

        if user.role == User.Role.BUYER and hasattr(user, "buyer"):
            return base.filter(buyer=user.buyer)
        if user.role == User.Role.FARMER and hasattr(user, "farmer"):
            return base.filter(farmer=user.farmer)
        return Order.objects.none()


class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, public_id):
        order = Order.objects.filter(id=public_id).first()
        if not order:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        allowed = {User.Role.FARMER, User.Role.TRANSPORTER, User.Role.MINISTRY}
        if user.role not in allowed:
            return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order.status = serializer.get_status_code()
        order.save(update_fields=["status"])

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class MyInvoicesView(generics.ListAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base = Payment.objects.select_related("order")
        if user.role == User.Role.BUYER and hasattr(user, "buyer"):
            return base.filter(order__buyer=user.buyer)
        if user.role == User.Role.FARMER and hasattr(user, "farmer"):
            return base.filter(order__farmer=user.farmer)
        return Payment.objects.none()
