from django.db import models


class Wilaya(models.Model):
    id = models.PositiveSmallIntegerField(primary_key=True, db_column="IDWilaya")
    code = models.CharField(max_length=2, unique=True, db_column="Code")
    name = models.CharField(max_length=100, unique=True, db_column="Name")

    class Meta:
        db_table = "Wilaya"
        ordering = ["id"]

    def __str__(self):
        return self.name


class Commune(models.Model):
    id = models.PositiveIntegerField(primary_key=True, db_column="IDCommune")
    wilaya = models.ForeignKey(
        Wilaya,
        on_delete=models.CASCADE,
        related_name="communes",
        db_column="IDWilaya",
    )
    name = models.CharField(max_length=120, db_column="Name")

    class Meta:
        db_table = "Commune"
        ordering = ["wilaya_id", "name"]
        constraints = [
            models.UniqueConstraint(fields=["wilaya", "name"], name="unique_commune_name_per_wilaya"),
        ]

    def __str__(self):
        return f"{self.name}, {self.wilaya.name}"

