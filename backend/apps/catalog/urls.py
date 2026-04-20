from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.catalog.views import (
    BuyerFilterOptionsView,
    CategoryViewSet,
    ControlledProductListView,
    ProductViewSet,
    RelatedProductsView,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("products", ProductViewSet, basename="products")

urlpatterns = [
    path("", include(router.urls)),
    path("predefined-products/", ControlledProductListView.as_view(), name="predefined-products"),
    path("filters/", BuyerFilterOptionsView.as_view(), name="buyer-filters"),
    path("products/<int:product_id>/related/", RelatedProductsView.as_view(), name="related-products"),
]
