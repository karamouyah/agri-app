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
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(is_active=True))
    name = serializers.CharField(source="product.name", read_only=True)
    category = serializers.IntegerField(source="product.category_id", read_only=True)
    category_name = serializers.CharField(source="product.category.name", read_only=True)
    unit = serializers.CharField(source="product.unit", read_only=True)
    min_price = serializers.IntegerField(source="product.min_price", read_only=True)
    max_price = serializers.IntegerField(source="product.max_price", read_only=True)
    min_price_dzd = serializers.IntegerField(source="product.min_price", read_only=True)
    max_price_dzd = serializers.IntegerField(source="product.max_price", read_only=True)
    is_active = serializers.BooleanField(source="product.is_active", read_only=True)
    currency = serializers.SerializerMethodField()
    price = serializers.IntegerField(min_value=0)
    quantity_available = serializers.IntegerField(source="quantity", min_value=0)
    farmer_name = serializers.SerializerMethodField()
    farmer_region = serializers.SerializerMethodField()
    farmer_wilaya_id = serializers.SerializerMethodField()
    farmer_wilaya = serializers.SerializerMethodField()
    farmer_commune_id = serializers.SerializerMethodField()
    farmer_commune = serializers.SerializerMethodField()
    quality = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = ProductList
        fields = [
            "id",
            "product",
            "name",
            "category",
            "category_name",
            "unit",
            "min_price",
            "max_price",
            "min_price_dzd",
            "max_price_dzd",
            "is_active",
            "currency",
            "price",
            "quantity_available",
            "farmer_name",
            "farmer_region",
            "farmer_wilaya_id",
            "farmer_wilaya",
            "farmer_commune_id",
            "farmer_commune",
            "quality",
            "image_url",
            "description",
            "status",
        ]

    def validate_price(self, value):
        product = self.initial_data.get("product")

        if product is not None:
            target = Product.objects.filter(id=product).first()
        elif self.instance:
            target = self.instance.product
        else:
            target = None

        if not target:
            return value

        if not target.is_active:
            raise serializers.ValidationError("This product is not available in the approved catalog.")

        if value < target.min_price or value > target.max_price:
            raise serializers.ValidationError(
                f"Price must be between {target.min_price} and {target.max_price} DZD"
            )

        return value

    def get_currency(self, _obj):
        return "DZD"

    def get_farmer_name(self, obj):
        full = f"{obj.farmer.person.first_name} {obj.farmer.person.last_name}".strip()
        return full or obj.farmer.person.email

    def get_farmer_region(self, obj):
        farm = obj.farmer.farms.order_by("id").first()
        return farm.location_label if farm else "Unknown"

    def get_farmer_wilaya_id(self, obj):
        farm = obj.farmer.farms.order_by("id").first()
        return farm.wilaya_id if farm else None

    def get_farmer_wilaya(self, obj):
        farm = obj.farmer.farms.select_related("wilaya").order_by("id").first()
        return farm.wilaya.name if farm and farm.wilaya else ""

    def get_farmer_commune_id(self, obj):
        farm = obj.farmer.farms.order_by("id").first()
        return farm.commune_id if farm else None

    def get_farmer_commune(self, obj):
        farm = obj.farmer.farms.select_related("commune").order_by("id").first()
        return farm.commune.name if farm and farm.commune else ""

    def get_quality(self, _obj):
        return "A"

    def get_image_url(self, _obj):
        return ""

    def get_description(self, _obj):
        return ""

    def get_status(self, obj):
        return "available" if obj.quantity > 0 else "out of stock"

    def create(self, validated_data):
        product = validated_data["product"]
        farmer = validated_data["farmer"]
        if ProductList.objects.filter(product=product, farmer=farmer).exists():
            raise serializers.ValidationError(
                {"product": "You already listed this product. Please edit the existing listing."}
            )
        return ProductList.objects.create(**validated_data)

    def update(self, instance, validated_data):
        target_product = validated_data.get("product", instance.product)

        if not target_product.is_active:
            raise serializers.ValidationError(
                {"product": "This product is not available in the approved catalog."}
            )

        if (
            ProductList.objects.filter(product=target_product, farmer=instance.farmer)
            .exclude(id=instance.id)
            .exists()
        ):
            raise serializers.ValidationError(
                {"product": "You already listed this product. Please edit the existing listing."}
            )

        if "product" in validated_data:
            instance.product = target_product

        if "price" in validated_data:
            instance.price = validated_data["price"]
        if "quantity" in validated_data:
            instance.quantity = validated_data["quantity"]

        instance.save(update_fields=["product", "price", "quantity"])
        return instance


class ControlledProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    min_price_dzd = serializers.IntegerField(source="min_price", read_only=True)
    max_price_dzd = serializers.IntegerField(source="max_price", read_only=True)
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "unit",
            "min_price",
            "max_price",
            "min_price_dzd",
            "max_price_dzd",
            "is_active",
            "currency",
        ]

    def get_currency(self, _obj):
        return "DZD"
