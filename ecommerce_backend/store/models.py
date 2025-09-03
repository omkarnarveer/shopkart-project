from django.db import models
from django.core.validators import MinValueValidator
# Create your models here.
# store/models.py

from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # The 'upload_to' argument specifies the subdirectory within MEDIA_ROOT
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    in_stock = models.BooleanField(default=True)
    quantity = models.PositiveIntegerField(default=0,validators=[MinValueValidator(0)])
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.50)

    def __str__(self):
        return self.name
    
class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    is_ordered = models.BooleanField(default=False)
    status = models.CharField(max_length=100, default="In Cart")

    @property
    def total_price(self):
        order_items = self.items.all()
        total = sum([item.total_price for item in order_items])
        return total

    def __str__(self):
        return f"Order {self.id} by {self.customer.username}"

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, related_name='items', on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=0)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def total_price(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.quantity} of {self.product.name}"