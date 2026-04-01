from collections import defaultdict

from django.db import IntegrityError
from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.common.permissions import IsMinistry
from apps.orders.models import OrderItem
from apps.users.models import Farmer, Farm, JoinRequest, User
from apps.users.serializers import (
    RegisterSerializer,
    UserApprovalUpdateSerializer,
    UserSerializer,
    UserTokenSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"


class LoginView(TokenObtainPairView):
    serializer_class = UserTokenSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"


class RefreshView(TokenRefreshView):
    permission_classes = [AllowAny]


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class AdminUserViewSet(ModelViewSet):
    queryset = (
        User.objects.select_related("farmer", "buyer", "transporter", "admin_profile")
        .prefetch_related("farmer__farms")
        .all()
        .order_by("-date_joined")
    )
    serializer_class = UserSerializer
    permission_classes = [IsMinistry]

    def get_queryset(self):
        queryset = super().get_queryset()
        role = (self.request.query_params.get("role") or "").strip().lower()
        approval_status = (self.request.query_params.get("approval_status") or "").strip().lower()

        if role:
            role_code = User.role_from_slug(role)
            if role_code is not None:
                queryset = queryset.filter(role=role_code)
            else:
                queryset = queryset.none()

        if approval_status:
            status_code = User.status_from_slug(approval_status)
            if status_code is not None:
                queryset = queryset.filter(status=status_code)
            else:
                queryset = queryset.none()

        return queryset

    def get_serializer_class(self):
        if self.action in {"partial_update", "update"}:
            return UserApprovalUpdateSerializer
        return UserSerializer

    @action(detail=False, methods=["get"], url_path="pending")
    def pending_accounts(self, request):
        queryset = self.get_queryset().filter(status=User.Status.PENDING)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def _join_request_status(user_status):
        if user_status == User.Status.APPROVED:
            return JoinRequest.RequestStatus.APPROVED
        if user_status == User.Status.REJECTED:
            return JoinRequest.RequestStatus.REJECTED
        return JoinRequest.RequestStatus.PENDING

    def _set_approval(self, user, approval_status):
        if user.role == User.Role.MINISTRY and approval_status != User.Status.APPROVED:
            return Response(
                {"detail": "Ministry accounts cannot be rejected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.status = approval_status
        user.save(update_fields=["status"])

        request_row = JoinRequest.objects.filter(email__iexact=user.email).order_by("-request_date", "-id").first()
        if request_row:
            request_row.status = self._join_request_status(approval_status)
            request_row.review_date = timezone.now()
            if hasattr(self.request.user, "admin_profile"):
                request_row.admin = self.request.user.admin_profile
            request_row.save(update_fields=["status", "review_date", "admin"])

        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="approve")
    def approve_account(self, request, pk=None):
        user = self.get_object()
        return self._set_approval(user, User.Status.APPROVED)

    @action(detail=True, methods=["post"], url_path="reject")
    def reject_account(self, request, pk=None):
        user = self.get_object()
        return self._set_approval(user, User.Status.REJECTED)


class NationalStatsView(APIView):
    permission_classes = [IsMinistry]

    def get(self, request):
        grouped = (
            User.objects.filter(status=User.Status.APPROVED)
            .values("role")
            .annotate(total=Count("id"))
        )
        totals = {row["role"]: row["total"] for row in grouped}

        region_rows = (
            OrderItem.objects.values("order__pickup_address")
            .annotate(volume=Sum("quantity"))
            .order_by("order__pickup_address")
        )
        regional_sales = [
            {"region": row["order__pickup_address"] or "Unknown", "volume": row["volume"] or 0}
            for row in region_rows
        ]

        total_volume = sum((row["volume"] or 0) for row in regional_sales)

        return Response(
            {
                "summary": {
                    "totalSalesVolumeTons": total_volume,
                    "activeFarmers": totals.get(User.Role.FARMER, 0),
                    "activeBuyers": totals.get(User.Role.BUYER, 0),
                    "activeTransporters": totals.get(User.Role.TRANSPORTER, 0),
                },
                "regionalSales": regional_sales,
                "priceTrends": [
                    {"month": "Jan", "tomatoes": 10, "oranges": 12, "potatoes": 6},
                    {"month": "Feb", "tomatoes": 9, "oranges": 11, "potatoes": 5},
                    {"month": "Mar", "tomatoes": 11, "oranges": 13, "potatoes": 6},
                ],
            },
            status=status.HTTP_200_OK,
        )


class GenerateReportView(APIView):
    permission_classes = [IsMinistry]

    def get(self, request):
        region = request.query_params.get("region")
        category = request.query_params.get("category")

        items = OrderItem.objects.select_related("order", "product_list__product__category")
        if region:
            items = items.filter(order__pickup_address__icontains=region)
        if category:
            items = items.filter(product_list__product__category__name=category)

        grouped = defaultdict(lambda: {"volume": 0, "revenue": 0})
        for item in items:
            region_name = item.order.pickup_address or "Unknown"
            category_name = item.product_list.product.category.name
            key = (region_name, category_name)
            grouped[key]["volume"] += item.quantity
            grouped[key]["revenue"] += item.total_items_price

        rows = [
            {
                "region": region_name,
                "category": category_name,
                "volume": agg["volume"],
                "revenue": round(float(agg["revenue"]), 2),
            }
            for (region_name, category_name), agg in grouped.items()
        ]

        return Response({"params": {"region": region, "category": category}, "rows": rows})


class FarmProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def _ensure_farmer_farm(self, user):
        farmer = getattr(user, "farmer", None)
        if not farmer:
            farmer = Farmer.objects.create(person=user)

        farm = farmer.farms.order_by("id").first()
        if not farm:
            farm = Farm.objects.create(
                farmer=farmer,
                name=f"{user.first_name or 'Farmer'} Farm",
                location=f"Farm address not set ({user.id})",
            )

        return farmer, farm

    def get(self, request):
        user = request.user
        if user.role != User.Role.FARMER:
            return Response({"detail": "Only farmers can access profile."}, status=status.HTTP_403_FORBIDDEN)

        _, farm = self._ensure_farmer_farm(user)

        return Response(
            {
                "name": farm.name,
                "location": farm.location,
                "description": user.documents_url,
                "contactInfo": user.phone_number,
                "farmAddress": farm.location,
            }
        )

    def patch(self, request):
        user = request.user
        if user.role != User.Role.FARMER:
            return Response({"detail": "Only farmers can update profile."}, status=status.HTTP_403_FORBIDDEN)

        _, farm = self._ensure_farmer_farm(user)

        farm_name = request.data.get("name", farm.name)
        location_value = request.data.get("location", farm.location)
        farm_address = request.data.get("farmAddress", location_value)
        description = request.data.get("description", user.documents_url)
        contact_info = request.data.get("contactInfo", user.phone_number)

        if isinstance(farm_name, str):
            farm_name = farm_name.strip()
        if isinstance(location_value, str):
            location_value = location_value.strip()
        if isinstance(farm_address, str):
            farm_address = farm_address.strip()
        if isinstance(description, str):
            description = description.strip()
        if isinstance(contact_info, str):
            contact_info = contact_info.strip()

        next_location = farm_address or location_value or farm.location

        farm.name = farm_name or farm.name
        farm.location = next_location
        user.documents_url = description
        user.phone_number = contact_info

        try:
            user.save(update_fields=["documents_url", "phone_number"])
            farm.save(update_fields=["name", "location"])
        except IntegrityError:
            return Response(
                {
                    "farmAddress": (
                        "A farmer is already registered with this farm address. "
                        "Please use a different farm address."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "name": farm.name,
                "location": farm.location,
                "description": user.documents_url,
                "contactInfo": user.phone_number,
                "farmAddress": farm.location,
            }
        )
