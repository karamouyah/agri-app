from django.contrib import admin

from apps.locations.models import Commune, Wilaya


@admin.register(Wilaya)
class WilayaAdmin(admin.ModelAdmin):
    list_display = ["id", "code", "name"]
    search_fields = ["name", "code"]


@admin.register(Commune)
class CommuneAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "wilaya"]
    list_filter = ["wilaya"]
    search_fields = ["name", "wilaya__name"]

