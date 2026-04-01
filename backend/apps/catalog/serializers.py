from rest_framework import serializers

from apps.catalog.models import Category, OfficialPrice, Product, ProductList, Season
from apps.users.models import AdminProfile, Farmer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class OfficialPriceSerializer(serializers.ModelSerializer):
    category = serializers.IntegerField(required=False)
    category_name = serializers.SerializerMethodField(read_only=True)
    minimum = serializers.IntegerField(required=False, min_value=0)
    maximum = serializers.IntegerField(required=False, min_value=0)
    suggested = serializers.IntegerField(required=False, min_value=0)

    class Meta:
        model = OfficialPrice
        fields = ["id", "category", "category_name", "minimum", "maximum", "suggested"]

    def get_category_name(self, obj):
        return obj.product.category.name

    @staticmethod
    def _pick_price_value(validated_data, fallback=0):
        for key in ("maximum", "suggested", "minimum"):
            if key in validated_data and validated_data.get(key) is not None:
                return validated_data.get(key)
        return fallback

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "category": instance.product.category_id,
            "category_name": instance.product.category.name,
            "minimum": instance.max_price,
            "maximum": instance.max_price,
            "suggested": instance.max_price,
        }

    def _resolve_admin(self):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and hasattr(user, "admin_profile"):
            return user.admin_profile

        admin_profile = AdminProfile.objects.select_related("person").first()
        if admin_profile:
            return admin_profile

        if user:
            return AdminProfile.objects.create(person=user)

        raise serializers.ValidationError({"detail": "No admin profile available for official price update."})

    @staticmethod
    def _resolve_default_season():
        season = Season.objects.order_by("id").first()
        if season:
            return season
        return Season.objects.create(name="Default")

    def _resolve_target_product(self, category_id):
        category = Category.objects.filter(id=category_id).first()
        if not category:
            raise serializers.ValidationError({"category": "Category does not exist."})

        product = Product.objects.filter(category=category).order_by("id").first()
        if product:
            return product

        return Product.objects.create(name=f"{category.name} Official Product", category=category)

    def create(self, validated_data):
        category_id = validated_data.get("category")
        if not category_id:
            raise serializers.ValidationError({"category": "Category is required."})

        max_price = self._pick_price_value(validated_data, fallback=0)

        product = self._resolve_target_product(category_id)
        season = self._resolve_default_season()
        admin_profile = self._resolve_admin()

        return OfficialPrice.objects.create(
            max_price=max_price,
            season=season,
            product=product,
            admin=admin_profile,
        )

    def update(self, instance, validated_data):
        category_id = validated_data.get("category")
        if category_id:
            instance.product = self._resolve_target_product(category_id)

        max_price = self._pick_price_value(validated_data, fallback=instance.max_price)
        instance.max_price = max_price
        instance.save(update_fields=["product", "max_price"])
        return instance


class ProductSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="product.name")
    category = serializers.PrimaryKeyRelatedField(source="product.category", queryset=Category.objects.all())
    category_name = serializers.CharField(source="product.category.name", read_only=True)
    price = serializers.IntegerField(min_value=0)
    quantity_available = serializers.IntegerField(source="quantity", min_value=0)
    farmer_name = serializers.SerializerMethodField()
    farmer_region = serializers.SerializerMethodField()
    quality = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = ProductList
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "price",
            "quantity_available",
            "farmer_name",
            "farmer_region",
            "quality",
            "image_url",
            "description",
            "status",
        ]

    def get_farmer_name(self, obj):
        full = f"{obj.farmer.person.first_name} {obj.farmer.person.last_name}".strip()
        return full or obj.farmer.person.email

    def get_farmer_region(self, obj):
        farm = obj.farmer.farms.order_by("id").first()
        return farm.location if farm else "Unknown"

    def get_quality(self, _obj):
        return "A"

    def get_image_url(self, _obj):
        return ""

    def get_description(self, _obj):
        return ""

    def get_status(self, obj):
        return "available" if obj.quantity > 0 else "out of stock"

    def create(self, validated_data):
        product_data = validated_data.pop("product")
        category = product_data["category"]
        name = product_data["name"]
        product = Product.objects.create(name=name, category=category)
        return ProductList.objects.create(product=product, **validated_data)

    def update(self, instance, validated_data):
        product_data = validated_data.pop("product", {})

        if "name" in product_data:
            instance.product.name = product_data["name"]
        if "category" in product_data:
            instance.product.category = product_data["category"]

        if product_data:
            instance.product.save(update_fields=["name", "category"])

        if "price" in validated_data:
            instance.price = validated_data["price"]
        if "quantity" in validated_data:
            instance.quantity = validated_data["quantity"]

        instance.save(update_fields=["price", "quantity"])
        return instance
