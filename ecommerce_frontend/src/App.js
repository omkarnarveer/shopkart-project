// src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import './App.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Helper function to make authenticated API calls
const apiCall = async (endpoint, method = 'GET', body = null) => {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    if (body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        // Try to parse error JSON, but handle cases where it's not JSON
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: 'An unknown API error occurred.' };
        }
        throw new Error(errorData.detail || 'An API error occurred');
    }
    if (response.status === 204) return null; // Handle No Content response
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

    // Effect to check for an existing session on initial load
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

    // Effect to fetch initial product and category data
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
            //alert(`${product.name} added to cart!`);
        } catch (err) {
            console.error("Failed to add item to cart:", err);
            alert("Could not add item. Please try again.");
        }
    };

    // Function to update item quantity (+ or -)
    const handleUpdateCartItem = async (itemId, action) => {
        try {
            const updatedCart = await apiCall(`/api/cart/item/${itemId}/`, 'PATCH', { action });
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to update cart item:", err);
            alert("Could not update item quantity.");
        }
    };

    // Function to remove an item from the cart
    const handleRemoveCartItem = async (itemId) => {
        // Use a standard confirm dialog
        if (!window.confirm("Are you sure you want to remove this item?")) return;
        try {
            const updatedCart = await apiCall(`/api/cart/item/${itemId}/`, 'DELETE');
            setCart(updatedCart);
        } catch (err) {
            console.error("Failed to remove cart item:", err);
            alert("Could not remove item from cart.");
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
                // Pass the new handler functions to the CartPage
                return <CartPage cart={cart} onUpdateItem={handleUpdateCartItem} onRemoveItem={handleRemoveCartItem} />;
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

    // Calculate cart count from the new cart object structure
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
