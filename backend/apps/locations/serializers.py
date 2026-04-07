from rest_framework import serializers

from apps.locations.models import Commune, Wilaya


class CommuneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commune
        fields = ["id", "name", "wilaya"]


class WilayaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wilaya
        fields = ["id", "code", "name"]


class WilayaTreeSerializer(serializers.ModelSerializer):
    communes = CommuneSerializer(many=True, read_only=True)

    class Meta:
        model = Wilaya
        fields = ["id", "code", "name", "communes"]


class LocationValidationSerializer(serializers.Serializer):
    wilaya_id = serializers.IntegerField()
    commune_id = serializers.IntegerField()

    def validate(self, attrs):
        wilaya = Wilaya.objects.filter(id=attrs["wilaya_id"]).first()
        commune = Commune.objects.filter(id=attrs["commune_id"]).first()

        if not wilaya:
            raise serializers.ValidationError({"wilaya_id": "Selected wilaya does not exist."})
        if not commune:
            raise serializers.ValidationError({"commune_id": "Selected commune does not exist."})
        if commune.wilaya_id != wilaya.id:
            raise serializers.ValidationError({"commune_id": "Selected commune does not belong to the wilaya."})

        attrs["wilaya"] = wilaya
        attrs["commune"] = commune
        return attrs

