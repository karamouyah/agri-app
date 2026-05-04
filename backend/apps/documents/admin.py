from django.contrib import admin
from django.utils.safestring import mark_safe

from apps.documents.models import VerificationDocument


@admin.register(VerificationDocument)
class VerificationDocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "role", "document_type", "image_preview", "status", "created_at")
    list_filter = ("role", "document_type", "status")
    search_fields = ("user__email", "user__first_name", "user__last_name")
    readonly_fields = ("image_preview", "created_at", "updated_at")

    def image_preview(self, obj):
        if obj.file:
            return mark_safe(f'<img src="{obj.file.url}" width="300" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />')
        return "No Image"
    image_preview.short_description = "Image Preview"
