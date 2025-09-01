import React from 'react';
import ProductCard from '../components/ProductCard';

const HomePage = ({ onNavigate, onAddToCart, products }) => {
    const featuredProducts = products.filter(p => p.rating > 4.5).slice(0, 3);

    return (
        <div>
            <div className="bg-blue-50">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">Find Your Next Favorite Thing</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Explore thousands of products, all in one place.</p>
                    <button onClick={() => onNavigate('products')} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-full text-lg hover:bg-blue-700 transform hover:scale-105 transition-all">
                        Shop Now
                    </button>
                </div>
            </div>
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
