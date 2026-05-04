from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils.encoding import smart_str
from django.utils.text import get_valid_filename
from rest_framework import generics, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response

from apps.common.permissions import IsMinistry
from apps.documents.models import VerificationDocument
from apps.documents.serializers import (
    AdminVerificationDocumentUpdateSerializer,
    VerificationDocumentSerializer,
    VerificationDocumentUploadSerializer,
)
from apps.users.models import User


class IsBuyerOrTransporter(BasePermission):
    allowed_roles = {User.Role.BUYER, User.Role.TRANSPORTER, User.Role.FARMER}

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role in self.allowed_roles)


def document_queryset():
    return VerificationDocument.objects.select_related("user").all()


def can_access_document(user, document):
    return bool(
        user
        and user.is_authenticated
        and (
            user == document.user
            or user.role == User.Role.MINISTRY
        )
    )


class VerificationDocumentUploadView(generics.CreateAPIView):
    serializer_class = VerificationDocumentUploadSerializer
    permission_classes = [IsAuthenticated, IsBuyerOrTransporter]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        document = serializer.save()
        return Response(
            VerificationDocumentSerializer(document, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class VerificationDocumentDownloadView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        document = get_object_or_404(document_queryset(), pk=kwargs["pk"])
        if not can_access_document(request.user, document):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if not document.file:
            raise Http404("Document file is missing.")

        try:
            file_handle = document.file.open("rb")
        except FileNotFoundError as exc:
            raise Http404("Document file is missing from storage.") from exc

        response = FileResponse(file_handle, as_attachment=True)
        filename = document.file.name.rsplit("/", 1)[-1]
        response["Content-Disposition"] = f'attachment; filename="{get_valid_filename(smart_str(filename))}"'
        return response


class MyVerificationDocumentsView(generics.ListAPIView):
    serializer_class = VerificationDocumentSerializer
    permission_classes = [IsAuthenticated, IsBuyerOrTransporter]

    def get_queryset(self):
        return document_queryset().filter(user=self.request.user)


class AdminVerificationDocumentsView(generics.ListAPIView):
    serializer_class = VerificationDocumentSerializer
    permission_classes = [IsMinistry]

    def get_queryset(self):
        return document_queryset()


class AdminVerificationDocumentDetailView(generics.UpdateAPIView):
    queryset = document_queryset()
    serializer_class = AdminVerificationDocumentUpdateSerializer
    permission_classes = [IsMinistry]
    http_method_names = ["patch", "options"]

    def patch(self, request, *args, **kwargs):
        allowed_fields = {"status", "admin_notes"}
        blocked_fields = set(request.data.keys()) - allowed_fields
        if blocked_fields:
            return Response(
                {"detail": "Only status and admin_notes can be updated."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        response = super().patch(request, *args, **kwargs)
        document = self.get_object()
        return Response(VerificationDocumentSerializer(document, context={"request": request}).data, status=response.status_code)

