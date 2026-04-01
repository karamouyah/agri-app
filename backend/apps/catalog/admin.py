from django.contrib import admin

from apps.catalog.models import Category, OfficialPrice, Product, ProductList, Season


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Season)
admin.site.register(OfficialPrice)
admin.site.register(ProductList)
