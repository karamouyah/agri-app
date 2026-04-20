from django.contrib import admin
from django.urls import include, path
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        return Response({"status": "ok"})


class ApiRootView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        return Response(
            {
                "message": "Agri API is running.",
                "health": "/api/health/",
                "auth": "/api/auth/",
                "products": "/api/products/",
                "locations": "/api/locations/",
                "catalog": "/api/catalog/",
                "orders": "/api/orders/",
                "logistics": "/api/logistics/",
            }
        )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", ApiRootView.as_view(), name="api-root"),
    path("api/health/", HealthView.as_view(), name="health"),
    path("api/auth/", include("apps.users.urls")),
    path("api/products/", include("apps.catalog.admin_product_urls")),
    path("api/locations/", include("apps.locations.urls")),
    path("api/catalog/", include("apps.catalog.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/logistics/", include("apps.logistics.urls")),
]
