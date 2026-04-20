from django.contrib import admin

from apps.logistics.models import ItemReview, Shipment, TransporterReview


admin.site.register(Shipment)
admin.site.register(TransporterReview)
admin.site.register(ItemReview)
