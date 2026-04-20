from rest_framework.permissions import BasePermission


class IsRole(BasePermission):
    allowed_roles = set()

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False

        role_value = getattr(user, "role_slug", None)
        if not role_value:
            raw_role = getattr(user, "role", None)
            role_value = str(raw_role).lower() if raw_role is not None else ""

        return role_value in self.allowed_roles


class IsMinistry(IsRole):
    allowed_roles = {"ministry"}


class IsFarmer(IsRole):
    allowed_roles = {"farmer"}


class IsBuyer(IsRole):
    allowed_roles = {"buyer"}


class IsTransporter(IsRole):
    allowed_roles = {"transporter"}
