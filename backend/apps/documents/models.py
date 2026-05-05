import os
import uuid
from PIL import Image, UnidentifiedImageError
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


ALLOWED_DOCUMENT_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}
MAX_DOCUMENT_SIZE = 5 * 1024 * 1024


def generate_uuid_filename(instance, filename):
    ext = filename.split('.')[-1].lower()
    return f"verification_documents/{instance.user_id}/{uuid.uuid4().hex}.{ext}"


def validate_verification_image(file):
    content_type = getattr(file, "content_type", "")
    if content_type and content_type not in ALLOWED_DOCUMENT_CONTENT_TYPES:
        raise ValidationError("Only JPG, PNG, or WEBP images are allowed.")

    if file.size > MAX_DOCUMENT_SIZE:
        raise ValidationError("Image file size must be 5 MB or less.")

    try:
        img = Image.open(file)
        img.verify() # Reads the magic number and verifies it is a valid image header
        file.seek(0)
    except (UnidentifiedImageError, Exception):
        raise ValidationError("Invalid image file. The file is corrupted or maliciously manipulated.")

# Alias for old migrations
validate_verification_file = validate_verification_image


class VerificationDocument(models.Model):
    class Role(models.TextChoices):
        FARMER = "farmer", "Farmer"
        BUYER = "buyer", "Buyer"
        TRANSPORTER = "transporter", "Transporter"

    class DocumentType(models.TextChoices):
        ID_CARD = "ID_CARD", "ID card"
        LICENSE = "LICENSE", "License"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="verification_documents",
    )
    role = models.CharField(max_length=20, choices=Role.choices)
    document_type = models.CharField(max_length=30, choices=DocumentType.choices)
    file = models.ImageField(upload_to=generate_uuid_filename, validators=[validate_verification_image])
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(fields=["user", "status"], name="doc_user_status_idx"),
        ]

    def __str__(self):
        return f"VerificationDocument<{self.id}:{self.role}:{self.status}>"
