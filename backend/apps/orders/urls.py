from django.urls import path

from apps.orders.views import CheckoutView, MyInvoicesView, MyOrdersView, UpdateOrderStatusView

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("mine/", MyOrdersView.as_view(), name="my-orders"),
    path("<str:public_id>/status/", UpdateOrderStatusView.as_view(), name="order-status"),
    path("invoices/mine/", MyInvoicesView.as_view(), name="my-invoices"),
]
