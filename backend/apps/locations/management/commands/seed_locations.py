from django.core.management.base import BaseCommand

from apps.locations.data import sync_algeria_locations


class Command(BaseCommand):
    help = "Seed the official Algeria wilayas and communes dataset."

    def handle(self, *args, **options):
        summary = sync_algeria_locations()
        self.stdout.write(
            self.style.SUCCESS(
                "Seeded Algeria locations: "
                f"{summary['wilayas']} wilayas and {summary['communes']} communes."
            )
        )

