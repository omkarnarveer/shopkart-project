# store/serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Category, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    # To show category name instead of ID
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = '__all__'

# Serializer for User Registration
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user
    
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Get the default token
        token = super().get_token(user)

        # Add custom claims (the data you want to include)
        token['username'] = user.username
        # You can add other fields here too, like email
        # token['email'] = user.email

        return token
    
class OrderItemSerializer(serializers.ModelSerializer):
    # We want to show product details, not just the ID
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    # Use the OrderItemSerializer for the nested 'items' relationship
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'customer', 'is_ordered', 'status', 'items', 'total_price']