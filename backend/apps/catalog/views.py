from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from apps.catalog.models import Category, OfficialPrice, Product, ProductList
from apps.catalog.serializers import (
    CategorySerializer,
    ControlledProductSerializer,
    OfficialPriceSerializer,
    ProductSerializer,
)
from apps.common.permissions import IsFarmer, IsMinistry
from apps.users.models import Farmer, Farm


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [IsAuthenticated()]
        return [IsMinistry()]


class OfficialPriceViewSet(ModelViewSet):
    queryset = OfficialPrice.objects.select_related("product", "product__category", "season", "admin").all()
    serializer_class = OfficialPriceSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [IsAuthenticated()]
        return [IsMinistry()]


class ProductViewSet(ModelViewSet):
    queryset = (
        ProductList.objects.select_related("product", "product__category", "farmer", "farmer__person")
        .filter(product__is_active=True)
        .all()
    )
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset().prefetch_related("farmer__farms")
        user = self.request.user
        query = self.request.query_params.get("q", "").strip()
        category = self.request.query_params.get("category")
        location = self.request.query_params.get("location")

        if getattr(user, "role", None) == user.Role.FARMER and hasattr(user, "farmer"):
            queryset = queryset.filter(farmer=user.farmer)

        if query:
            queryset = queryset.filter(
                Q(product__name__icontains=query)
                | Q(farmer__person__first_name__icontains=query)
                | Q(farmer__person__last_name__icontains=query)
            )
        if category:
            queryset = queryset.filter(product__category__name=category)
        if location:
            queryset = queryset.filter(farmer__farms__location__icontains=location)

        return queryset.distinct()

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [IsAuthenticated()]
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [IsFarmer()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        farmer = getattr(user, "farmer", None)
        if not farmer:
            farmer = Farmer.objects.create(person=user)
            if not farmer.farms.exists():
                Farm.objects.create(
                    farmer=farmer,
                    name=f"{user.first_name or 'Farmer'} Farm",
                    location=f"Farm address not set ({user.id})",
                )
        serializer.save(farmer=farmer)


class ControlledProductListView(generics.ListAPIView):
    serializer_class = ControlledProductSerializer
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.select_related("category").filter(is_active=True).order_by("category__name", "name")

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get("q", "").strip()
        category = self.request.query_params.get("category", "").strip()

        if query:
            queryset = queryset.filter(name__icontains=query)

        if category:
            queryset = queryset.filter(category__name__iexact=category)

        return queryset


class BuyerFilterOptionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        locations = list(Farm.objects.values_list("location", flat=True).distinct())
        return Response(
            {
                "categories": list(
                    Category.objects.filter(products__is_active=True).distinct().values_list("name", flat=True)
                ),
                "locations": sorted(set(locations)),
                "qualities": ["A"],
            }
        )


class RelatedProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        product_id = self.kwargs["product_id"]
        listing = ProductList.objects.select_related("product").filter(id=product_id).first()
        if not listing:
            return ProductList.objects.none()

        return (
            ProductList.objects.select_related("product", "product__category", "farmer", "farmer__person")
            .prefetch_related("farmer__farms")
            .filter(product__is_active=True)
            .filter(product__category=listing.product.category)
            .exclude(id=product_id)[:3]
        )
