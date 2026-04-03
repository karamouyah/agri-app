import random
from collections import defaultdict
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.utils.text import slugify
from faker import Faker

from apps.catalog.catalog_data import sync_controlled_catalog
from apps.catalog.models import Category, OfficialPrice, Product, ProductList, Season
from apps.logistics.models import ItemReview, Shipment, TransporterReview
from apps.orders.models import Order, OrderItem, Payment
from apps.users.models import AdminProfile, Buyer, Farm, Farmer, JoinRequest, Transporter, User


SEED_EMAIL_DOMAIN = "seed.agrigov.dz"
DEFAULT_PASSWORD = "SeedPass123!"
DEFAULT_RANDOM_SEED = 20260402
DEFAULT_MINISTRY_COUNT = 2
DEFAULT_FARMER_COUNT = 10
DEFAULT_BUYER_COUNT = 10
DEFAULT_TRANSPORTER_COUNT = 10
DEFAULT_LISTING_COUNT = 45
DEFAULT_ORDER_COUNT = 30

ALGERIAN_FIRST_NAMES = [
    "Ahmed",
    "Amine",
    "Amina",
    "Aya",
    "Bilal",
    "Farid",
    "Hakim",
    "Ines",
    "Karim",
    "Khadidja",
    "Lamia",
    "Mehdi",
    "Meriem",
    "Nadia",
    "Nassim",
    "Rachid",
    "Rania",
    "Sabrina",
    "Sofiane",
    "Walid",
    "Yasmine",
    "Yassine",
    "Zakaria",
]

ALGERIAN_LAST_NAMES = [
    "Abdelkader",
    "Ait Ali",
    "Amrani",
    "Belaid",
    "Belkacem",
    "Benaissa",
    "Benali",
    "Benkhelifa",
    "Bensaid",
    "Boualem",
    "Boukhalfa",
    "Cherif",
    "Djebbar",
    "Ferhat",
    "Ghezali",
    "Kaci",
    "Khellaf",
    "Mansouri",
    "Meziane",
    "Saadi",
    "Touati",
    "Yahiaoui",
    "Zerrouki",
]

ALGERIAN_WILAYAS = [
    ("Algiers", ["Bab Ezzouar", "Bir Mourad Rais", "Draria", "El Harrach", "Kouba"]),
    ("Blida", ["Beni Tamou", "Boufarik", "Chebli", "Meftah", "Mouzaia"]),
    ("Boumerdes", ["Boudouaou", "Corso", "Dellys", "Khemis El Khechna", "Thenia"]),
    ("Tipaza", ["Cherchell", "Douaouda", "Hadjout", "Kolea", "Tipaza"]),
    ("Medea", ["Berrouaghia", "Ksar El Boukhari", "Medea", "Ouzera", "Tablat"]),
    ("Setif", ["Ain Arnat", "Ain Oulmene", "El Eulma", "Guidjel", "Setif"]),
    ("Oran", ["Arzew", "Bir El Djir", "Es Senia", "Misserghin", "Oran"]),
    ("Mostaganem", ["Ain Nouissy", "Bouguirat", "Mazagran", "Mostaganem", "Sidi Ali"]),
    ("Tlemcen", ["Chetouane", "Ghazaouet", "Maghnia", "Mansourah", "Remchi"]),
    ("Constantine", ["Ain Smara", "El Khroub", "Hamma Bouziane", "Constantine", "Zighoud Youcef"]),
]

FARM_NAME_PREFIXES = ["Domaine", "Exploitation", "Ferme", "Jardin", "Parc Agricole", "Verger"]
FARM_NAME_SUFFIXES = ["Al Amal", "Al Baraka", "Atlas", "El Bahia", "El Fellah", "Nour"]
HOME_STREET_NAMES = [
    "Cite 500 Logements",
    "Cite Emir Abdelkader",
    "Cite El Yasmine",
    "Hai El Qods",
    "Residence El Badr",
    "Rue des Oliviers",
    "Rue du 1er Novembre",
]
FARM_ROUTE_NAMES = [
    "Chemin des Amandiers",
    "Chemin des Agrumes",
    "Route de la Plaine",
    "Route des Vergers",
    "Route El Khair",
    "Route des Serres",
]
VEHICLE_TYPES = [
    "Camion frigorifique Hyundai HD78",
    "Camion Renault Midlum",
    "Camionnette Iveco Daily",
    "Fourgon Peugeot Boxer",
    "Fourgon Renault Master",
    "Pickup Isuzu D-Max",
    "Pickup Nissan Navara",
    "Utilitaire Fiat Ducato",
]
PAYMENT_METHODS = ["cash_on_delivery", "bank_transfer", "card"]
ITEM_REVIEW_TEXTS = [
    "Fresh produce and very clean packaging.",
    "Quality was consistent and the order matched the listing.",
    "Good taste, good freshness, and timely preparation.",
    "Reliable farmer and product quality met expectations.",
]
TRANSPORT_REVIEW_TEXTS = [
    "Delivery was punctual and handled with care.",
    "Transporter communicated clearly and arrived on time.",
    "Professional service with good product handling.",
]

ORDER_STATUS_WEIGHTS = [
    (Order.Status.PENDING, 5),
    (Order.Status.ACCEPTED, 5),
    (Order.Status.DECLINED, 2),
    (Order.Status.SHIPPED, 4),
    (Order.Status.IN_TRANSIT, 7),
    (Order.Status.DELIVERED, 7),
]

SHIPMENT_STATUS_BY_ORDER_STATUS = {
    Order.Status.PENDING: Shipment.Status.PENDING,
    Order.Status.ACCEPTED: Shipment.Status.ACCEPTED,
    Order.Status.DECLINED: Shipment.Status.DECLINED,
    Order.Status.SHIPPED: Shipment.Status.PICKED_UP,
    Order.Status.IN_TRANSIT: Shipment.Status.IN_TRANSIT,
    Order.Status.DELIVERED: Shipment.Status.DELIVERED,
}


class Command(BaseCommand):
    help = "Seed realistic Algerian development data for AgriGov using Django ORM and Faker."

    def add_arguments(self, parser):
        parser.add_argument("--seed", type=int, default=DEFAULT_RANDOM_SEED, help="Deterministic random seed.")
        parser.add_argument("--ministries", type=int, default=DEFAULT_MINISTRY_COUNT, help="Number of ministry users.")
        parser.add_argument("--farmers", type=int, default=DEFAULT_FARMER_COUNT, help="Number of farmers to create.")
        parser.add_argument("--buyers", type=int, default=DEFAULT_BUYER_COUNT, help="Number of buyers to create.")
        parser.add_argument(
            "--transporters",
            type=int,
            default=DEFAULT_TRANSPORTER_COUNT,
            help="Number of transporters to create.",
        )
        parser.add_argument(
            "--listings",
            type=int,
            default=DEFAULT_LISTING_COUNT,
            help="Number of farmer product listings to create.",
        )
        parser.add_argument("--orders", type=int, default=DEFAULT_ORDER_COUNT, help="Number of orders to create.")
        parser.add_argument(
            "--keep-existing",
            action="store_true",
            help="Keep previously generated seed users instead of clearing old generated records first.",
        )

    def handle(self, *args, **options):
        self.random = random.Random(options["seed"])
        self.fake = Faker("fr_FR")
        Faker.seed(options["seed"])
        self.fake.seed_instance(options["seed"])
        self.used_farm_locations = set()
        self.status_plan = {
            "farmer": self._build_status_plan(options["farmers"], approved_ratio=0.7, pending_ratio=0.2),
            "buyer": self._build_status_plan(options["buyers"], approved_ratio=0.8, pending_ratio=0.1),
            "transporter": self._build_status_plan(options["transporters"], approved_ratio=0.8, pending_ratio=0.1),
        }

        self.stdout.write(self.style.NOTICE("Preparing AgriGov development seed data..."))

        with transaction.atomic():
            if not options["keep_existing"]:
                self._reset_generated_data()

            sync_controlled_catalog(Category, Product)
            season = self._get_current_season()
            ministries = self._seed_ministry_users(max(1, options["ministries"]))
            farmers = self._seed_farmer_users(options["farmers"])
            buyers = self._seed_buyer_users(options["buyers"])
            transporters = self._seed_transporter_users(options["transporters"])

            approved_farmers = [item for item in farmers if item.person.status == User.Status.APPROVED]
            approved_buyers = [item for item in buyers if item.person.status == User.Status.APPROVED]
            approved_transporters = [item for item in transporters if item.person.status == User.Status.APPROVED]

            if not approved_farmers:
                raise ValueError("The generated dataset must contain at least one approved farmer.")
            if not approved_buyers:
                raise ValueError("The generated dataset must contain at least one approved buyer.")

            target_listings = min(max(options["listings"], 30), Product.objects.filter(is_active=True).count())
            listings = self._seed_product_listings(target_listings, approved_farmers)
            self._seed_official_prices(ministries[0], season, listings)
            orders = self._seed_orders(options["orders"], approved_buyers, approved_transporters, listings)
            self._seed_reviews(orders)
            self._seed_join_requests()

        self._print_summary()

    def _print_summary(self):
        summary = {
            "users": User.objects.filter(email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "ministries": AdminProfile.objects.filter(person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "farmers": Farmer.objects.filter(person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "buyers": Buyer.objects.filter(person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "transporters": Transporter.objects.filter(person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "farms": Farm.objects.filter(farmer__person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "catalog_products": Product.objects.filter(is_active=True).count(),
            "product_listings": ProductList.objects.filter(farmer__person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "official_prices": OfficialPrice.objects.filter(admin__person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "orders": Order.objects.filter(buyer__person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "payments": Payment.objects.filter(order__buyer__person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "shipments": Shipment.objects.filter(order__buyer__person__email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
            "join_requests": JoinRequest.objects.filter(email__iendswith=f"@{SEED_EMAIL_DOMAIN}").count(),
        }

        self.stdout.write(self.style.SUCCESS("AgriGov development data seeded successfully."))
        for label, value in summary.items():
            self.stdout.write(f" - {label.replace('_', ' ').title()}: {value}")
        self.stdout.write(f" - Default password for generated users: {DEFAULT_PASSWORD}")

    def _build_status_plan(self, total, approved_ratio, pending_ratio):
        if total <= 0:
            return []

        approved_count = max(1, round(total * approved_ratio))
        pending_count = round(total * pending_ratio)
        if total >= 3:
            pending_count = max(1, pending_count)
            rejected_count = max(1, total - approved_count - pending_count)
        else:
            pending_count = max(0, min(total - approved_count, pending_count))
            rejected_count = max(0, total - approved_count - pending_count)

        while approved_count + pending_count + rejected_count > total:
            if approved_count > 1:
                approved_count -= 1
            elif pending_count > 0:
                pending_count -= 1
            else:
                rejected_count -= 1

        while approved_count + pending_count + rejected_count < total:
            approved_count += 1

        statuses = (
            [User.Status.APPROVED] * approved_count
            + [User.Status.PENDING] * pending_count
            + [User.Status.REJECTED] * rejected_count
        )
        self.random.shuffle(statuses)
        return statuses

    def _reset_generated_data(self):
        seed_users = User.objects.filter(email__iendswith=f"@{SEED_EMAIL_DOMAIN}")
        seed_user_ids = list(seed_users.values_list("id", flat=True))
        if not seed_user_ids:
            return

        seed_orders = Order.objects.filter(
            Q(buyer__person_id__in=seed_user_ids) | Q(farmer__person_id__in=seed_user_ids)
        )
        seed_shipments = Shipment.objects.filter(
            Q(order__in=seed_orders) | Q(transporter__person_id__in=seed_user_ids)
        )

        TransporterReview.objects.filter(
            Q(buyer__person_id__in=seed_user_ids) | Q(shipment__in=seed_shipments)
        ).delete()
        ItemReview.objects.filter(order_item__order__in=seed_orders).delete()
        seed_shipments.delete()
        Payment.objects.filter(order__in=seed_orders).delete()
        OrderItem.objects.filter(order__in=seed_orders).delete()
        seed_orders.delete()

        OfficialPrice.objects.filter(admin__person_id__in=seed_user_ids).delete()
        ProductList.objects.filter(farmer__person_id__in=seed_user_ids).delete()
        Farm.objects.filter(farmer__person_id__in=seed_user_ids).delete()
        JoinRequest.objects.filter(email__iendswith=f"@{SEED_EMAIL_DOMAIN}").delete()

        AdminProfile.objects.filter(person_id__in=seed_user_ids).delete()
        Transporter.objects.filter(person_id__in=seed_user_ids).delete()
        Buyer.objects.filter(person_id__in=seed_user_ids).delete()
        Farmer.objects.filter(person_id__in=seed_user_ids).delete()
        User.objects.filter(id__in=seed_user_ids).delete()

    def _get_current_season(self):
        season_name = f"{timezone.now().year} Main Season"
        season, _ = Season.objects.get_or_create(name=season_name)
        return season

    def _upsert_user(self, role_slug, index, first_name, last_name, status, address, is_staff=False, is_superuser=False):
        role = User.role_from_slug(role_slug)
        email = self._build_email(role_slug, index, first_name, last_name)
        user, _ = User.objects.update_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
                "address": address,
                "phone_number": self._generate_phone_number(),
                "personal_picture_url": f"https://seed.agrigov.dz/avatars/{role_slug}-{index:02d}.jpg",
                "documents_url": f"https://seed.agrigov.dz/documents/{role_slug}-{index:02d}.pdf",
                "role": role,
                "status": status,
                "is_staff": is_staff,
                "is_superuser": is_superuser,
                "is_active": status != User.Status.REJECTED,
            },
        )
        user.set_password(DEFAULT_PASSWORD)
        user.save(update_fields=["password"])
        return user

    def _build_email(self, role_slug, index, first_name, last_name):
        local_part = slugify(f"{role_slug}-{index:02d}-{first_name}-{last_name}") or f"{role_slug}-{index:02d}"
        return f"{local_part}@{SEED_EMAIL_DOMAIN}"

    def _pick_name(self, index, offset):
        first_name = ALGERIAN_FIRST_NAMES[
            (index + offset + self.random.randint(0, len(ALGERIAN_FIRST_NAMES) - 1)) % len(ALGERIAN_FIRST_NAMES)
        ]
        last_name = ALGERIAN_LAST_NAMES[
            (index + offset + self.random.randint(0, len(ALGERIAN_LAST_NAMES) - 1)) % len(ALGERIAN_LAST_NAMES)
        ]
        return first_name, last_name

    def _pick_city(self, index, offset):
        wilaya, cities = ALGERIAN_WILAYAS[
            (index + offset + self.random.randint(0, len(ALGERIAN_WILAYAS) - 1)) % len(ALGERIAN_WILAYAS)
        ]
        city = cities[(index + offset + self.random.randint(0, len(cities) - 1)) % len(cities)]
        return city, wilaya

    def _build_home_address(self, city, wilaya, index, offset):
        street_name = HOME_STREET_NAMES[
            (index + offset + self.random.randint(0, len(HOME_STREET_NAMES) - 1)) % len(HOME_STREET_NAMES)
        ]
        block = self.fake.numerify("##")
        building = self.fake.numerify("##")
        return f"Bloc {block}, Immeuble {building}, {street_name}, {city}, {wilaya}, Algeria"

    def _build_farm_name(self, index):
        prefix = FARM_NAME_PREFIXES[(index + self.random.randint(0, len(FARM_NAME_PREFIXES) - 1)) % len(FARM_NAME_PREFIXES)]
        suffix = FARM_NAME_SUFFIXES[(index + self.random.randint(0, len(FARM_NAME_SUFFIXES) - 1)) % len(FARM_NAME_SUFFIXES)]
        return f"{prefix} {suffix}"

    def _build_unique_farm_location(self, index, city, wilaya):
        while True:
            route_name = FARM_ROUTE_NAMES[
                (index + self.random.randint(0, len(FARM_ROUTE_NAMES) - 1)) % len(FARM_ROUTE_NAMES)
            ]
            parcel = self.fake.numerify("###")
            location = f"Parcelle {parcel}, {route_name}, {city}, {wilaya}, Algeria"
            if location.lower() not in self.used_farm_locations:
                self.used_farm_locations.add(location.lower())
                return location

    def _build_service_area(self, city, wilaya):
        extra_pairs = self.random.sample(ALGERIAN_WILAYAS, k=2)
        nearby_segments = [f"{extra_cities[0]}, {extra_wilaya}" for extra_wilaya, extra_cities in extra_pairs]
        return f"{city}, {wilaya} -> " + " -> ".join(nearby_segments)

    def _generate_phone_number(self):
        prefix = self.random.choice(["5", "6", "7"])
        return f"+213{prefix}{self.fake.numerify('########')}"

    def _seed_ministry_users(self, total):
        ministries = []
        for index in range(1, total + 1):
            first_name, last_name = self._pick_name(index, offset=100)
            city, wilaya = self._pick_city(index, offset=200)
            user = self._upsert_user(
                role_slug="ministry",
                index=index,
                first_name=first_name,
                last_name=last_name,
                status=User.Status.APPROVED,
                is_staff=True,
                is_superuser=False,
                address=self._build_home_address(city, wilaya, index, offset=300),
            )
            admin_profile, _ = AdminProfile.objects.update_or_create(
                person=user,
                defaults={
                    "total_processes": self.random.randint(60, 400),
                    "region_code": index,
                },
            )
            ministries.append(admin_profile)
        return ministries

    def _seed_farmer_users(self, total):
        farmers = []
        for index in range(1, total + 1):
            first_name, last_name = self._pick_name(index, offset=400)
            city, wilaya = self._pick_city(index, offset=500)
            status = self.status_plan["farmer"][index - 1]
            user = self._upsert_user(
                role_slug="farmer",
                index=index,
                first_name=first_name,
                last_name=last_name,
                status=status,
                address=self._build_home_address(city, wilaya, index, offset=600),
            )
            farmer, _ = Farmer.objects.update_or_create(
                person=user,
                defaults={
                    "average_rating": self.random.randint(3, 5) if status == User.Status.APPROVED else None,
                    "total_reviews": self.random.randint(3, 60) if status == User.Status.APPROVED else None,
                },
            )
            Farm.objects.update_or_create(
                farmer=farmer,
                defaults={
                    "name": self._build_farm_name(index),
                    "location": self._build_unique_farm_location(index, city, wilaya),
                    "area": self.random.randint(4, 90),
                },
            )
            farmers.append(farmer)
        return farmers

    def _seed_buyer_users(self, total):
        buyers = []
        for index in range(1, total + 1):
            first_name, last_name = self._pick_name(index, offset=700)
            city, wilaya = self._pick_city(index, offset=800)
            status = self.status_plan["buyer"][index - 1]
            user = self._upsert_user(
                role_slug="buyer",
                index=index,
                first_name=first_name,
                last_name=last_name,
                status=status,
                address=self._build_home_address(city, wilaya, index, offset=900),
            )
            buyer, _ = Buyer.objects.get_or_create(person=user)
            buyers.append(buyer)
        return buyers

    def _seed_transporter_users(self, total):
        transporters = []
        for index in range(1, total + 1):
            first_name, last_name = self._pick_name(index, offset=1000)
            city, wilaya = self._pick_city(index, offset=1100)
            status = self.status_plan["transporter"][index - 1]
            user = self._upsert_user(
                role_slug="transporter",
                index=index,
                first_name=first_name,
                last_name=last_name,
                status=status,
                address=self._build_home_address(city, wilaya, index, offset=1200),
            )
            transporter, _ = Transporter.objects.update_or_create(
                person=user,
                defaults={
                    "capacity": self.random.randint(900, 12000),
                    "service_area": self._build_service_area(city, wilaya),
                    "vehicle_type": self.random.choice(VEHICLE_TYPES),
                    "average_rating": self.random.randint(3, 5) if status == User.Status.APPROVED else None,
                    "total_reviews": self.random.randint(2, 40) if status == User.Status.APPROVED else None,
                },
            )
            transporters.append(transporter)
        return transporters

    def _seed_product_listings(self, total, approved_farmers):
        active_catalog = list(Product.objects.filter(is_active=True).select_related("category").order_by("name"))
        total = min(total, len(active_catalog))
        selected_products = self.random.sample(active_catalog, k=total)
        farmer_pool = approved_farmers[:]
        self.random.shuffle(farmer_pool)
        listings = []

        for index, product in enumerate(selected_products, start=1):
            farmer = farmer_pool[(index - 1) % len(farmer_pool)]
            listing, _ = ProductList.objects.update_or_create(
                farmer=farmer,
                product=product,
                defaults={
                    "quantity": self.random.randint(220, 2600),
                    "price": self.random.randint(product.min_price, product.max_price),
                },
            )
            listings.append(listing)

        return listings

    def _seed_official_prices(self, admin_profile, season, listings):
        used_products = {listing.product for listing in listings}
        for product in used_products:
            official_price, _ = OfficialPrice.objects.get_or_create(
                product=product,
                season=season,
                admin=admin_profile,
                defaults={"max_price": product.max_price},
            )
            if official_price.max_price != product.max_price:
                official_price.max_price = product.max_price
                official_price.save(update_fields=["max_price"])

    def _seed_orders(self, total, buyers, transporters, listings):
        listings_by_farmer = defaultdict(list)
        remaining_quantities = {}
        for listing in listings:
            listings_by_farmer[listing.farmer_id].append(listing)
            remaining_quantities[listing.id] = listing.quantity

        orders = []
        statuses = [status for status, _weight in ORDER_STATUS_WEIGHTS]
        weights = [weight for _status, weight in ORDER_STATUS_WEIGHTS]
        buyer_pool = buyers[:]
        self.random.shuffle(buyer_pool)
        transporter_pool = transporters[:]
        self.random.shuffle(transporter_pool)

        for index in range(1, total + 1):
            eligible_farmers = [
                farmer_id
                for farmer_id, farmer_listings in listings_by_farmer.items()
                if any(remaining_quantities[listing.id] >= 25 for listing in farmer_listings)
            ]
            if not eligible_farmers:
                break

            farmer_id = self.random.choice(eligible_farmers)
            available_listings = [
                listing for listing in listings_by_farmer[farmer_id] if remaining_quantities[listing.id] >= 25
            ]
            item_count = min(len(available_listings), self.random.randint(1, 3))
            chosen_listings = self.random.sample(available_listings, k=item_count)
            status = self.random.choices(statuses, weights=weights, k=1)[0]
            buyer = buyer_pool[(index - 1) % len(buyer_pool)]
            farmer = chosen_listings[0].farmer
            farm = farmer.farms.order_by("id").first()
            order_date = self.fake.date_time_between(
                start_date="-120d",
                end_date="-1d",
                tzinfo=timezone.get_current_timezone(),
            )

            order = Order.objects.create(
                buyer=buyer,
                farmer=farmer,
                delivery_address=buyer.person.address,
                pickup_address=farm.location if farm else farmer.person.address,
                status=status,
                total_amount=0,
            )

            total_amount = 0
            reserved_quantities = []
            for listing in chosen_listings:
                max_quantity = min(remaining_quantities[listing.id], max(25, listing.quantity // 4))
                quantity = self.random.randint(20, max(20, max_quantity))
                quantity = min(quantity, remaining_quantities[listing.id])
                line_total = quantity * listing.price
                total_amount += line_total
                reserved_quantities.append((listing, quantity))
                OrderItem.objects.create(
                    order=order,
                    product_list=listing,
                    quantity=quantity,
                    price=listing.price,
                    total_items_price=line_total,
                )

            if status != Order.Status.DECLINED:
                for listing, quantity in reserved_quantities:
                    remaining_quantities[listing.id] -= quantity

            order.total_amount = total_amount
            order.order_date = order_date
            order.save(update_fields=["total_amount", "order_date"])

            payment = Payment.objects.create(
                order=order,
                amount=total_amount,
                payment_method=self.random.choice(PAYMENT_METHODS),
            )
            payment.transaction_date = order_date + timedelta(minutes=self.random.randint(5, 180))
            payment.save(update_fields=["transaction_date"])

            transporter = None
            if status in {Order.Status.ACCEPTED, Order.Status.SHIPPED, Order.Status.IN_TRANSIT, Order.Status.DELIVERED}:
                transporter = transporter_pool[(index - 1) % len(transporter_pool)] if transporter_pool else None

            pickup_date = order_date + timedelta(hours=self.random.randint(12, 72))
            estimated_delivery = pickup_date + timedelta(days=self.random.randint(1, 4))
            shipment = Shipment.objects.create(
                order=order,
                transporter=transporter,
                tracking_number=f"AGD-{timezone.now().year}-{index:04d}",
                status=SHIPMENT_STATUS_BY_ORDER_STATUS[status],
                shipping_fee=self.random.randint(500, 2500),
                pickup_date=pickup_date if status != Order.Status.PENDING else None,
                estimated_delivery_date=estimated_delivery if status != Order.Status.DECLINED else None,
                actual_delivery_date=estimated_delivery if status == Order.Status.DELIVERED else None,
            )
            if status == Order.Status.DECLINED:
                shipment.pickup_date = None
                shipment.actual_delivery_date = None
                shipment.save(update_fields=["pickup_date", "actual_delivery_date"])

            orders.append(order)

        for listing in listings:
            listing.quantity = remaining_quantities[listing.id]
            listing.save(update_fields=["quantity"])

        return orders

    def _seed_reviews(self, orders):
        delivered_orders = [order for order in orders if order.status == Order.Status.DELIVERED]
        for order in delivered_orders[: min(12, len(delivered_orders))]:
            shipment = order.shipments.order_by("id").first()
            if shipment and shipment.transporter:
                review, _ = TransporterReview.objects.get_or_create(
                    buyer=order.buyer,
                    shipment=shipment,
                    defaults={
                        "rating": self.random.randint(4, 5),
                        "review_text": self.random.choice(TRANSPORT_REVIEW_TEXTS),
                    },
                )
                review.review_date = shipment.actual_delivery_date or timezone.now()
                review.save(update_fields=["review_date"])

            for order_item in order.items.all()[:2]:
                item_review, _ = ItemReview.objects.get_or_create(
                    order_item=order_item,
                    defaults={
                        "rating": self.random.randint(4, 5),
                        "review_text": self.random.choice(ITEM_REVIEW_TEXTS),
                    },
                )
                item_review.review_date = shipment.actual_delivery_date or timezone.now()
                item_review.save(update_fields=["review_date"])

    def _seed_join_requests(self):
        request_statuses = [
            JoinRequest.RequestStatus.PENDING,
            JoinRequest.RequestStatus.APPROVED,
            JoinRequest.RequestStatus.REJECTED,
        ]
        requested_roles = [User.Role.FARMER, User.Role.BUYER, User.Role.TRANSPORTER]

        for index in range(1, 4):
            first_name, last_name = self._pick_name(index, offset=1300)
            city, wilaya = self._pick_city(index, offset=1400)
            email = f"joinrequest{index:02d}@{SEED_EMAIL_DOMAIN}"
            JoinRequest.objects.update_or_create(
                email=email,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "phone_number": self._generate_phone_number(),
                    "address": self._build_home_address(city, wilaya, index, offset=1500),
                    "requested_role": self.random.choice(requested_roles),
                    "notes": "Generated for development seed data.",
                    "status": request_statuses[index - 1],
                },
            )
