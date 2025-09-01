import React from 'react';

const Header = ({ onNavigate, cartItemCount, user, onLogout }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <button onClick={() => onNavigate('home')} className="text-2xl font-bold text-blue-600">ShopKart</button>
                    <div className="hidden md:flex items-baseline space-x-4">
                        <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</button>
                        <button onClick={() => onNavigate('products')} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">All Products</button>
                    </div>
                    <div className="flex items-center">
                        <button onClick={() => onNavigate('cart')} className="relative p-2 rounded-full text-gray-600 hover:text-blue-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            {cartItemCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{cartItemCount}</span>}
                        </button>
                        {user ? (
                            <div className="ml-4 flex items-center">
                                <span className="text-gray-600 mr-3">Welcome, {user.username}</span>
                                <button onClick={onLogout} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">Logout</button>
                            </div>
                        ) : (
                            <button onClick={() => onNavigate('login')} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Login</button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;