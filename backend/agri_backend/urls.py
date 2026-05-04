"""
File responsibility: Connects the Django project URL paths to each backend app API router.
Connects to the Django backend through imports, app configuration, API routing, or management commands.
"""

# Imports: load Django, DRF, models, serializers, and helpers used in this module.
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView


def health_check(request):
    """Simple database-independent health check endpoint."""
    return JsonResponse({"status": "ok"})





class ApiRootView(APIView):
    """Defines ApiRootView for this app and is used by the serializers, views, routes, or admin when imported."""
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        """Handles get, using the declared parameters and returning the expected value or API response."""
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
                "reports": "/api/reports/",
                "documents": "/api/documents/",
            }
        )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", ApiRootView.as_view(), name="api-root"),
    path("api/health/", health_check, name="health"),
    path("api/auth/", include("apps.users.urls")),
    path("api/products/", include("apps.catalog.admin_product_urls")),
    path("api/locations/", include("apps.locations.urls")),
    path("api/catalog/", include("apps.catalog.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/logistics/", include("apps.logistics.urls")),
    path("api/reports/", include("apps.reports.urls")),
    path("api/documents/", include("apps.documents.urls")),
]

# Serve media files efficiently.
# In development, Django handles this automatically via the `static()` helper if appended,
# but we explicitly define a re_path for `serve` so it functions in production on Railway Volume.
# Note: Ensure the Web Server (Gunicorn) is properly configured, or offload this to an Nginx proxy 
# for higher performance if traffic scales.
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]
