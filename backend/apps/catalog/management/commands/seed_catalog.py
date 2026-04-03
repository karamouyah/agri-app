from django.core.management.base import BaseCommand

from apps.catalog.catalog_data import sync_controlled_catalog
from apps.catalog.models import Category, Product


class Command(BaseCommand):
    help = "Seed the controlled product catalog used by farmers."

    def handle(self, *args, **options):
        catalog = sync_controlled_catalog(Category, Product)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(catalog)} approved catalog products."))
