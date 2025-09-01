# store/urls.py

from django.urls import path
from .views import CartView, CartItemView, ProductListView, CategoryListView, RegisterView, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('cart/', CartView.as_view(), name='cart-view'),
    path('cart/item/<int:item_id>/', CartItemView.as_view(), name='cart-item-manage'),
    # Auth URLs
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), # <-- This line is updated
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]