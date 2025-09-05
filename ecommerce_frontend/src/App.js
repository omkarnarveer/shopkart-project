import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import CheckoutPage from './pages/CheckoutPage'; 
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

import './App.css';

const API_BASE_URL = 'http://127.0.0.1:8000';
const apiCall = async (endpoint, method = 'GET', body = null) => {
    let config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    if (body) {
        config.body = JSON.stringify(body);
    }
    
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
        console.log("Access token expired. Attempting to refresh...");
    
        const refreshResponse = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') })
        });
        
        if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('accessToken', data.access);
            console.log("Token refreshed successfully. Retrying original request...");
            
            // Update the authorization header with the new token
            config.headers['Authorization'] = `Bearer ${data.access}`;
            
            // Retry the original request
            response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
            console.log("Refresh token is also invalid. Logging out.");
            // If refresh fails, you would typically trigger a logout here.
            // For now, we'll just let the original error be thrown.
        }
    }

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: 'An unknown API error occurred.' };
        }
        throw new Error(errorData.detail || 'An API error occurred');
    }
    
    if (response.status === 204) return null;
    return response.json();
};



function App() {
    const [page, setPage] = useState({ name: 'home', props: {} });
    const [cart, setCart] = useState(null);
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const decodeToken = (token) => {
        try { return JSON.parse(atob(token.split('.')[1])); }
        catch (e) { return null; }
    };

    const handleNavigate = useCallback((pageName, props = {}) => {
        setPage({ name: pageName, props: { id: props } });
        window.scrollTo(0, 0);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setCart(null);
        handleNavigate('home');
    }, [handleNavigate]);

    const fetchCart = useCallback(async () => {
        if (!localStorage.getItem('accessToken')) return;
        try {
            const cartData = await apiCall('/api/cart/');
            setCart(cartData);
        } catch (err) {
            console.error("Could not load cart:", err);
            if (err.message.includes('401')) {
                handleLogout();
            }
        }
    }, [handleLogout]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.exp * 1000 > Date.now()) {
                setUser({ username: decoded.username });
                fetchCart();
            } else {
                handleLogout();
            }
        }
    }, [handleLogout, fetchCart]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/products/`),
                    fetch(`${API_BASE_URL}/api/categories/`)
                ]);
                setProducts(await productsRes.json());
                setCategories(await categoriesRes.json());
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleLogin = (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        const decoded = decodeToken(accessToken);
        if (decoded && decoded.username) {
            setUser({ username: decoded.username });
            fetchCart();
            handleNavigate('welcome');
        } else {
            console.log("Login failed: Token was invalid.");
            handleLogout();
        }
    };

    const handleAddToCart = async (product) => {
        if (!user) {
            handleNavigate('login');
            return;
        }
        try {
            const updatedCart = await apiCall('/api/cart/', 'POST', { product_id: product.id });
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to add item to cart:", err);
            alert("Could not add item. Please try again.");
        }
    };

    const handleUpdateCartItem = async (itemId, action) => {
        try {
            const updatedCart = await apiCall(`/api/cart/item/${itemId}/`, 'PATCH', { action });
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to update cart item:", err);
            alert("Could not update item quantity.");
        }
    };

    const handleRemoveCartItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to remove this item?")) return;
        try {
            const updatedCart = await apiCall(`/api/cart/item/${itemId}/`, 'DELETE');
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to remove cart item:", err);
            alert("Could not remove item from cart.");
        }
    };
    
    const handlePlaceOrder = async () => {
    try {
        // 1. Send a POST request to the '/api/orders/' endpoint.
        // This triggers the `post` method in your Django OrderView,
        // which creates a permanent order from the cart items.
        await apiCall('/api/orders/', 'POST');
        
        // 2. After the backend confirms the order is created,
        // clear the cart in the frontend's state.
        setCart(null); 
        
        // 3. Navigate the user to the success page.
        handleNavigate('orderConfirmation');

    } catch (err) {
        // If the backend returns an error, display an alert to the user.
        console.error("Failed to place order:", err);
        alert("There was an issue placing your order. Please try again.");
    }
};

    const renderPage = () => {
        if (loading) return <div className="text-center py-20"><h2>Loading...</h2></div>;

        const { name, props } = page;
        switch (name) {
            case 'home':
                return <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} products={products} />;
            case 'products':
                return <ProductsPage onAddToCart={handleAddToCart} onNavigate={handleNavigate} products={products} categories={categories} />;
            case 'productDetail':
                return <ProductDetailPage productId={props.id} onAddToCart={handleAddToCart} products={products} />;
            case 'cart':
                return <CartPage cart={cart} onUpdateItem={handleUpdateCartItem} onRemoveItem={handleRemoveCartItem} onNavigate={handleNavigate}/>;
            
            case 'checkout':
              return <CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} />;

            case 'orderConfirmation': 
              return <OrderConfirmationPage onNavigate={handleNavigate} />;

            case 'orderHistory':
              return <OrderHistoryPage apiCall={apiCall} onNavigate={handleNavigate} />;

            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
            case 'register':
                return <RegisterPage onNavigate={handleNavigate} />;
            case 'welcome':
                return <WelcomePage user={user} onNavigate={handleNavigate} />;
            default:
                return <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} products={products} />;
        }
    };

    const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div className="bg-gray-50 font-sans">
            <Header onNavigate={handleNavigate} cartItemCount={cartItemCount} user={user} onLogout={handleLogout} />
            <main className="container mx-auto px-4 py-8 fade-in">{renderPage()}</main>
            <footer className="bg-gray-800 text-white py-6 mt-12">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 ShopKart. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;