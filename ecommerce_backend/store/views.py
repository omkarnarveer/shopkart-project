# store/views.py
# --- Django Imports ---
from django.contrib.auth.models import User

# --- DRF Imports ---
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response  # <-- THIS IS THE MISSING IMPORT
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

# --- Local Imports (from your app) ---
from .models import Product, Category, Order, OrderItem
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    UserSerializer,
    OrderSerializer,
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
    
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get or create an active cart for the current user
        cart, created = Order.objects.get_or_create(customer=request.user, is_ordered=False, status='In Cart')
        serializer = OrderSerializer(cart)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Get or create an active cart
        cart, created = Order.objects.get_or_create(customer=request.user, is_ordered=False, status='In Cart')
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get or create the order item and update its quantity
        order_item, created = OrderItem.objects.get_or_create(order=cart, product=product)

        if not created:
            order_item.quantity += quantity
        else:
            order_item.quantity = quantity
        
        order_item.save()

        # Return the entire updated cart
        serializer = OrderSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id, *args, **kwargs):
        try:
            order_item = OrderItem.objects.get(id=item_id, order__customer=request.user)
        except OrderItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action == 'add':
            order_item.quantity += 1
        elif action == 'remove':
            order_item.quantity -= 1
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        
        if order_item.quantity <= 0:
            order_item.delete()
        else:
            order_item.save()

        # Return the entire updated cart
        cart = Order.objects.get(customer=request.user, is_ordered=False, status='In Cart')
        serializer = OrderSerializer(cart)
        return Response(serializer.data)

    def delete(self, request, item_id, *args, **kwargs):
        try:
            order_item = OrderItem.objects.get(id=item_id, order__customer=request.user)
            order_item.delete()
        except OrderItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
            
        # Return the entire updated cart
        cart = Order.objects.get(customer=request.user, is_ordered=False, status='In Cart')
        serializer = OrderSerializer(cart)
        return Response(serializer.data)