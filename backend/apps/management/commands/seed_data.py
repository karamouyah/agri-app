from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.catalog.models import Category, OfficialPrice, Product, ProductList, Season
from apps.logistics.models import Shipment
from apps.orders.models import Order, OrderItem, Payment
from apps.users.models import AdminProfile, Buyer, Farmer, Farm, Transporter, User


class Command(BaseCommand):
    help = "Seed development data for the agri platform"

    def handle(self, *args, **options):
        ministry, _ = User.objects.get_or_create(
            email="ministry@agri.ma",
            defaults={
                "username": "ministry@agri.ma",
                "first_name": "Ministry",
                "last_name": "Admin",
                "role": User.Role.MINISTRY,
                "status": User.Status.APPROVED,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
                "phone_number": "+212655000001",
            },
        )
        ministry.set_password("AdminPass123!")
        ministry.save()
        admin_profile, _ = AdminProfile.objects.get_or_create(person=ministry)

        farmer_user, _ = User.objects.get_or_create(
            email="farmer@agri.ma",
            defaults={
                "username": "farmer@agri.ma",
                "first_name": "Green",
                "last_name": "Valley",
                "role": User.Role.FARMER,
                "status": User.Status.APPROVED,
                "is_active": True,
                "phone_number": "+212600000000",
            },
        )
        farmer_user.set_password("FarmerPass123!")
        farmer_user.save()

        farmer, _ = Farmer.objects.get_or_create(person=farmer_user)
        farm, _ = Farm.objects.get_or_create(
            farmer=farmer,
            defaults={
                "name": "Green Valley Farm",
                "location": "Green Valley Farm, Meknes",
                "area": 300,
            },
        )

        buyer_user, _ = User.objects.get_or_create(
            email="buyer@agri.ma",
            defaults={
                "username": "buyer@agri.ma",
                "first_name": "Atlas",
                "last_name": "Buyer",
                "role": User.Role.BUYER,
                "status": User.Status.APPROVED,
                "is_active": True,
                "phone_number": "+212611000000",
                "address": "12 Market Street, Rabat",
            },
        )
        buyer_user.set_password("BuyerPass123!")
        buyer_user.save()
        buyer, _ = Buyer.objects.get_or_create(person=buyer_user)

        transporter_user, _ = User.objects.get_or_create(
            email="transporter@agri.ma",
            defaults={
                "username": "transporter@agri.ma",
                "first_name": "Rapid",
                "last_name": "Logistics",
                "role": User.Role.TRANSPORTER,
                "status": User.Status.APPROVED,
                "is_active": True,
                "phone_number": "+212622000000",
            },
        )
        transporter_user.set_password("TransportPass123!")
        transporter_user.save()
        transporter, _ = Transporter.objects.get_or_create(
            person=transporter_user,
            defaults={
                "vehicle_type": "Iveco Daily Van",
                "service_area": "Meknes-Rabat",
                "capacity": 1500,
            },
        )

        veggies, _ = Category.objects.get_or_create(name="Vegetables")
        fruits, _ = Category.objects.get_or_create(name="Fruits")

        tomatoes_product, _ = Product.objects.get_or_create(name="Cherry Tomatoes", category=veggies)
        potatoes_product, _ = Product.objects.get_or_create(name="White Potatoes", category=veggies)

        season, _ = Season.objects.get_or_create(name="Spring")

        OfficialPrice.objects.get_or_create(
            product=tomatoes_product,
            season=season,
            admin=admin_profile,
            defaults={"max_price": 18},
        )
        OfficialPrice.objects.get_or_create(
            product=potatoes_product,
            season=season,
            admin=admin_profile,
            defaults={"max_price": 10},
        )

        tomatoes_listing, _ = ProductList.objects.get_or_create(
            product=tomatoes_product,
            farmer=farmer,
            defaults={"quantity": 320, "price": 14},
        )

        potatoes_listing, _ = ProductList.objects.get_or_create(
            product=potatoes_product,
            farmer=farmer,
            defaults={"quantity": 1200, "price": 6},
        )

        order, _ = Order.objects.get_or_create(
            buyer=buyer,
            farmer=farmer,
            delivery_address="12 Market Street, Rabat",
            pickup_address=farm.location,
            defaults={
                "status": Order.Status.IN_TRANSIT,
                "total_amount": 1320,
            },
        )

        OrderItem.objects.get_or_create(
            order=order,
            product_list=tomatoes_listing,
            defaults={"quantity": 60, "price": 14, "total_items_price": 840},
        )
        OrderItem.objects.get_or_create(
            order=order,
            product_list=potatoes_listing,
            defaults={"quantity": 80, "price": 6, "total_items_price": 480},
        )

        Payment.objects.get_or_create(
            order=order,
            defaults={
                "amount": order.total_amount,
                "payment_method": "cash_on_delivery",
            },
        )

        Shipment.objects.get_or_create(
            order=order,
            defaults={
                "transporter": transporter,
                "tracking_number": "MIS-7001",
                "status": Shipment.Status.IN_TRANSIT,
                "shipping_fee": 0,
                "pickup_date": timezone.now(),
                "estimated_delivery_date": timezone.now() + timedelta(days=3),
            },
        )

        self.stdout.write(self.style.SUCCESS("Seed data loaded successfully."))
