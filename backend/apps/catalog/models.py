from django.db import models

from apps.users.models import AdminProfile, Farmer


class Category(models.Model):
    id = models.AutoField(primary_key=True, db_column="IDCategory")
    name = models.CharField(max_length=100, db_column="Name")

    class Meta:
        db_table = "Category"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.AutoField(primary_key=True, db_column="IDProduct")
    name = models.CharField(max_length=100, db_column="Name")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, db_column="IDCategory", related_name="products")

    class Meta:
        db_table = "Product"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Season(models.Model):
    id = models.AutoField(primary_key=True, db_column="IDSeason")
    name = models.CharField(max_length=100, db_column="Name")

    class Meta:
        db_table = "Season"
        ordering = ["name"]

    def __str__(self):
        return self.name


class OfficialPrice(models.Model):
    id = models.AutoField(primary_key=True, db_column="IDOfficialPrice")
    max_price = models.IntegerField(db_column="MaxPrice")
    season = models.ForeignKey(Season, on_delete=models.PROTECT, db_column="IDSeason", related_name="official_prices")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, db_column="IDProduct", related_name="official_prices")
    admin = models.ForeignKey(AdminProfile, on_delete=models.PROTECT, db_column="IDAdmin", related_name="official_prices")

    class Meta:
        db_table = "OfficialPrice"


class ProductList(models.Model):
    id = models.AutoField(primary_key=True, db_column="IDProductList")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, db_column="IDProduct", related_name="listings")
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, db_column="IDFarmer", related_name="product_listings")
    quantity = models.IntegerField(default=0, db_column="Quantity")
    price = models.IntegerField(default=0, db_column="Price")

    class Meta:
        db_table = "ProductList"

    def __str__(self):
        return f"{self.product.name} ({self.farmer.person.email})"
