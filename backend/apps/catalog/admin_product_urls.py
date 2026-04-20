from django.urls import path

from apps.catalog.views import AdminProductViewSet


admin_product_list = AdminProductViewSet.as_view({"get": "list", "post": "create"})
admin_product_detail = AdminProductViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy"})


urlpatterns = [
    path("", admin_product_list, name="admin-product-list"),
    path("<int:pk>/", admin_product_detail, name="admin-product-detail"),
]
