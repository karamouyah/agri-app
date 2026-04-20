from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.users.models import AdminProfile, Buyer, Farmer, Farm, JoinRequest, Transporter, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ["email"]
    list_display = ["id", "email", "role_slug", "approval_status", "status", "is_staff"]
    list_filter = ["role", "status", "is_staff"]

    fieldsets = BaseUserAdmin.fieldsets + (
        (
            "Person Info",
            {
                "fields": (
                    "role",
                    "status",
                    "address",
                    "phone_number",
                    "personal_picture_url",
                    "documents_url",
                )
            },
        ),
    )

    @admin.display(description="Role")
    def role_slug(self, obj):
        return obj.role_slug

    @admin.display(description="Approval")
    def approval_status(self, obj):
        return obj.approval_status_slug


@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ["id", "person", "average_rating", "total_reviews"]
    search_fields = ["person__email"]


@admin.register(Buyer)
class BuyerAdmin(admin.ModelAdmin):
    list_display = ["id", "person", "wilaya", "commune"]
    list_filter = ["wilaya"]
    search_fields = ["person__email", "wilaya__name", "commune__name"]


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ["id", "person", "total_processes", "region_code"]
    search_fields = ["person__email"]


@admin.register(Transporter)
class TransporterAdmin(admin.ModelAdmin):
    list_display = ["id", "person", "vehicle_type", "max_load_kg", "service_area", "capacity"]
    list_filter = ["delivery_wilayas"]
    filter_horizontal = ["delivery_wilayas"]
    search_fields = ["person__email", "vehicle_type", "delivery_wilayas__name"]


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ["id", "farmer", "name", "location", "wilaya", "commune", "area"]
    list_filter = ["wilaya"]
    search_fields = ["name", "location", "wilaya__name", "commune__name", "farmer__person__email"]


@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "requested_role", "status", "request_date", "review_date", "admin"]
    list_filter = ["status", "requested_role"]
    search_fields = ["email", "first_name", "last_name"]
