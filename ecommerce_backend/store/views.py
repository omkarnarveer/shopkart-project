# store/views.py
# --- Django Imports ---
from django.contrib.auth.models import User
from django.db import transaction
# --- DRF Imports ---
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response  # <-- THIS IS THE MISSING IMPORT
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Cart 
# --- Local Imports (from your app) ---
from .models import Product, Category, Order, OrderItem
from .models import Product, Category, Order, OrderItem, Cart, CartItem
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    UserSerializer,
    OrderSerializer,
    CartSerializer, 
    MyTokenObtainPairSerializer
)

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
    
class ClearCartView(APIView):
    """
    An endpoint to clear all items from the user's cart.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Find the cart associated with the currently logged-in user
            cart = Cart.objects.get(user=request.user)
            # Delete all items within that cart
            cart.items.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Cart.DoesNotExist:
            # If the user has no cart, there's nothing to clear.
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class CartView(APIView):
    """
    Handles getting the user's active shopping cart and adding items.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # FIX: This view now correctly uses the Cart model.
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # FIX: This logic correctly uses CartItem.
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            cart_item.quantity += 1
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CartItemView(APIView):
    """
    Handles updating and deleting individual items within a cart.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        try:
            # FIX: This now correctly queries CartItem
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action == 'add':
            cart_item.quantity += 1
            cart_item.save()
        elif action == 'remove':
            cart_item.quantity -= 1
            if cart_item.quantity > 0:
                cart_item.save()
            else:
                cart_item.delete()

        serializer = CartSerializer(cart_item.cart)
        return Response(serializer.data)

    def delete(self, request, pk, *args, **kwargs):
        try:
            cart_item = CartItem.objects.get(pk=pk, cart__user=request.user)
            cart = cart_item.cart
            cart_item.delete()
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response({"detail": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

# --- CORRECTED ORDER VIEW ---

class OrderView(APIView):
    """
    Handles creating new orders from a cart and listing order history.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # This correctly fetches permanent Order records
        orders = Order.objects.filter(customer=request.user).order_by('-date_ordered')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        try:
            cart = Cart.objects.get(user=request.user)
            cart_items = cart.items.all()

            if not cart_items.exists():
                return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

            # Use a transaction for data safety
            with transaction.atomic():
                order = Order.objects.create(
                    customer=request.user, 
                    is_ordered=True, 
                    status="Completed"
                )
                
                # Copy items from the temporary cart to permanent order items
                for cart_item in cart_items:
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        quantity=cart_item.quantity
                    )
                
                # Clear the temporary cart
                cart_items.delete()

            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)