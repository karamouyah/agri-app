from django.contrib import admin

from apps.catalog.models import Category, OfficialPrice, Product, ProductList, Season


admin.site.register(Category)
admin.site.register(Season)
admin.site.register(OfficialPrice)
admin.site.register(ProductList)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "unit", "min_price", "max_price", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("name",)
