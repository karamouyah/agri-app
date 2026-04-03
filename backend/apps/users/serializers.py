import re

from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError, transaction
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.users.models import Buyer, Farmer, Farm, JoinRequest, Transporter, User


class FarmerProfileSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source="person.phone_number", read_only=True)
    farm_address = serializers.SerializerMethodField()

    class Meta:
        model = Farmer
        fields = ["phone_number", "farm_address"]

    def get_farm_address(self, obj):
        farm = obj.farms.order_by("id").first()
        return farm.location if farm else ""


class TransporterProfileSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source="person.phone_number", read_only=True)
    vehicle = serializers.CharField(source="vehicle_type", read_only=True)
    service_area = serializers.CharField(read_only=True)
    capacity = serializers.IntegerField(read_only=True)
    average_rating = serializers.IntegerField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Transporter
        fields = [
            "phone_number",
            "vehicle",
            "service_area",
            "capacity",
            "average_rating",
            "total_reviews",
        ]


class BuyerProfileSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source="person.phone_number", read_only=True)
    address = serializers.CharField(source="person.address", read_only=True)

    class Meta:
        model = Buyer
        fields = ["phone_number", "address"]


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    approval_status = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    personal_picture_url = serializers.CharField(read_only=True)
    phone_number = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    farm_address = serializers.SerializerMethodField()
    vehicle = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "name",
            "role",
            "status",
            "approval_status",
            "first_name",
            "last_name",
            "personal_picture_url",
            "profile",
            "phone_number",
            "phone",
            "farm_address",
            "vehicle",
            "address",
        ]

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username or obj.email

    def get_role(self, obj):
        return obj.role_slug

    def get_approval_status(self, obj):
        return obj.approval_status_slug

    def get_profile(self, obj):
        if obj.role == User.Role.FARMER and hasattr(obj, "farmer"):
            return FarmerProfileSerializer(obj.farmer).data
        if obj.role == User.Role.TRANSPORTER and hasattr(obj, "transporter"):
            return TransporterProfileSerializer(obj.transporter).data
        if obj.role == User.Role.BUYER and hasattr(obj, "buyer"):
            return BuyerProfileSerializer(obj.buyer).data
        return None

    def get_phone_number(self, obj):
        return obj.phone_number

    def get_phone(self, obj):
        return obj.phone_number

    def get_farm_address(self, obj):
        if obj.role == User.Role.FARMER and hasattr(obj, "farmer"):
            farm = obj.farmer.farms.order_by("id").first()
            return farm.location if farm else ""
        return ""

    def get_vehicle(self, obj):
        if obj.role == User.Role.TRANSPORTER and hasattr(obj, "transporter"):
            return obj.transporter.vehicle_type
        return ""

    def get_address(self, obj):
        if obj.role == User.Role.BUYER:
            return obj.address
        return ""

    def to_representation(self, instance):
        payload = super().to_representation(instance)
        payload["status"] = instance.approval_status_slug
        return payload


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    farm_address = serializers.CharField(write_only=True, required=False, allow_blank=True)
    farm_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    vehicle = serializers.CharField(write_only=True, required=False, allow_blank=True)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True)

    PHONE_REGEX = re.compile(r"^\+?[0-9()\-\s]{7,20}$")

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "role",
            "name",
            "phone_number",
            "phone",
            "farm_address",
            "farm_name",
            "vehicle",
            "address",
        ]
        read_only_fields = ["id"]

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_name(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Full name is required.")
        return cleaned

    @staticmethod
    def _clean_text(attrs, field_name):
        value = attrs.get(field_name, "")
        if value is None:
            value = ""
        if isinstance(value, str):
            value = value.strip()
        attrs[field_name] = value
        return value

    def validate(self, attrs):
        role_slug = self._clean_text(attrs, "role").lower()
        role_code = User.role_from_slug(role_slug)

        phone_number = self._clean_text(attrs, "phone_number")
        phone_alias = self._clean_text(attrs, "phone")
        farm_address = self._clean_text(attrs, "farm_address")
        vehicle = self._clean_text(attrs, "vehicle")
        address = self._clean_text(attrs, "address")
        self._clean_text(attrs, "farm_name")

        if not phone_number and phone_alias:
            phone_number = phone_alias
            attrs["phone_number"] = phone_number

        errors = {}
        role_label = role_slug.capitalize() or "Selected role"
        allowed_signup_roles = {"farmer", "buyer", "transporter"}

        if role_slug not in allowed_signup_roles or not role_code:
            errors["role"] = "Invalid signup role."

        if not phone_number:
            errors["phone_number"] = f"Phone number is required for {role_label} signup."
        elif not self.PHONE_REGEX.fullmatch(phone_number):
            errors["phone_number"] = "Enter a valid phone number."

        if role_slug == "farmer":
            if not farm_address:
                errors["farm_address"] = "Farm address is required for Farmer signup."
            elif Farm.objects.filter(location__iexact=farm_address).exists():
                errors["farm_address"] = (
                    "A farmer is already registered with this farm address. "
                    "Please use a different farm address."
                )

        if role_slug == "transporter" and not vehicle:
            errors["vehicle"] = "Vehicle is required for Transporter signup."

        if role_slug == "buyer" and not address:
            errors["address"] = "Address is required for Buyer signup."

        if errors:
            raise serializers.ValidationError(errors)

        attrs["_role_code"] = role_code
        attrs["_role_slug"] = role_slug
        return attrs

    def create(self, validated_data):
        name = validated_data.pop("name", "")
        first_name, _, last_name = name.strip().partition(" ")
        role_code = validated_data.pop("_role_code")
        role_slug = validated_data.pop("_role_slug")

        phone_number = validated_data.pop("phone_number", "")
        validated_data.pop("phone", None)
        farm_address = validated_data.pop("farm_address", "")
        farm_name = validated_data.pop("farm_name", "")
        vehicle = validated_data.pop("vehicle", "")
        address = validated_data.pop("address", "")
        password = validated_data.pop("password")
        email = validated_data["email"]

        try:
            with transaction.atomic():
                user = User(
                    username=email,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role=role_code,
                    status=User.Status.PENDING,
                    address=address if role_slug == "buyer" else "",
                    phone_number=phone_number,
                )
                user.set_password(password)
                user.save()

                if role_slug == "farmer":
                    farmer = Farmer.objects.create(person=user)
                    Farm.objects.create(
                        farmer=farmer,
                        name=farm_name or f"{first_name or 'Farmer'} Farm",
                        location=farm_address,
                    )
                elif role_slug == "transporter":
                    Transporter.objects.create(person=user, vehicle_type=vehicle)
                elif role_slug == "buyer":
                    Buyer.objects.create(person=user)

                JoinRequest.objects.create(
                    first_name=first_name,
                    last_name=last_name,
                    email=user.email,
                    phone_number=phone_number,
                    address=farm_address if role_slug == "farmer" else address,
                    requested_role=role_code,
                    status=JoinRequest.RequestStatus.PENDING,
                )
        except IntegrityError as exc:
            if role_slug == "farmer" and farm_address:
                raise serializers.ValidationError(
                    {
                        "farm_address": (
                            "A farmer is already registered with this farm address. "
                            "Please use a different farm address."
                        )
                    }
                ) from exc
            raise

        return user

    def to_representation(self, instance):
        return UserSerializer(instance, context=self.context).data


class UserTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role_slug
        token["status"] = user.approval_status_slug
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.status == User.Status.PENDING:
            raise AuthenticationFailed("Your account is waiting for ministry approval.")

        if self.user.status == User.Status.REJECTED:
            raise AuthenticationFailed(
                "Your account has been rejected by the ministry. Please contact support."
            )

        data["user"] = UserSerializer(self.user).data
        return data


class UserApprovalUpdateSerializer(serializers.ModelSerializer):
    approval_status = serializers.ChoiceField(choices=["pending", "approved", "rejected"])

    class Meta:
        model = User
        fields = ["approval_status"]

    def update(self, instance, validated_data):
        approval_slug = validated_data["approval_status"]
        new_status = User.status_from_slug(approval_slug)
        instance.status = new_status
        instance.save(update_fields=["status"])
        return instance
