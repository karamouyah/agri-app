from django.db import models

from apps.catalog.models import ProductList
from apps.users.models import Buyer, Farmer


class Order(models.Model):
    class Status(models.IntegerChoices):
        PENDING = 0, "Pending"
        ACCEPTED = 1, "Accepted"
        DECLINED = 2, "Declined"
        SHIPPED = 3, "Shipped"
        IN_TRANSIT = 4, "In Transit"
        DELIVERED = 5, "Delivered"

    id = models.AutoField(primary_key=True, db_column="IDOrder")
    buyer = models.ForeignKey(Buyer, on_delete=models.PROTECT, db_column="IDBuyer", related_name="orders")
    farmer = models.ForeignKey(Farmer, on_delete=models.PROTECT, db_column="IDFarmer", related_name="orders")
    total_amount = models.IntegerField(default=0, db_column="TotalAmount")
    order_date = models.DateTimeField(auto_now_add=True, db_column="OrderDate")
    status = models.PositiveSmallIntegerField(choices=Status.choices, default=Status.PENDING, db_column="Status")
    delivery_address = models.CharField(max_length=255, blank=True, db_column="DeliveryAddress")
    pickup_address = models.CharField(max_length=255, blank=True, db_column="PickupAddress")

    class Meta:
        db_table = "Orders"
        ordering = ["-order_date"]


class OrderItem(models.Model):
    id = models.AutoField(primary_key=True, db_column="IDOrderItem")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, db_column="IDOrder", related_name="items")
    product_list = models.ForeignKey(
        ProductList,
        on_delete=models.PROTECT,
        db_column="IDProductList",
        related_name="order_items",
    )
    quantity = models.IntegerField(db_column="Quantity")
    price = models.IntegerField(db_column="Price")
    total_items_price = models.IntegerField(db_column="TotalItemsPrice")


class Payment(models.Model):
    id = models.AutoField(primary_key=True, db_column="IDPayment")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, db_column="IDOrder", related_name="payments")
    amount = models.IntegerField(db_column="Amount")
    payment_method = models.CharField(max_length=100, db_column="PaymentMethod")
    transaction_date = models.DateTimeField(auto_now_add=True, db_column="TransactionDate")

    class Meta:
        db_table = "Payments"
