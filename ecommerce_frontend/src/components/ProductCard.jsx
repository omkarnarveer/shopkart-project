import React from 'react';
import { StarIcon } from '../assets/icons';

const ProductCard = ({ product, onAddToCart, onNavigate }) => {
    const { name, category, price, rating, in_stock: inStock, image } = product;
    
    const imageUrl = image || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
    
    const categoryName = typeof category === 'object' && category !== null ? category.name : category;

    return (
        // Added 'group' class for advanced hover effects and transitions
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 group">
            <div className="relative">
                {/* FIX: Added a container with padding and a background color for better framing */}
                <div className="p-4 bg-gray-50">
                    <img 
                        onClick={() => onNavigate('productDetail', product.id)} 
                        // FIX: Changed to object-contain to respect aspect ratio and center the image
                        className="w-full h-48 object-contain cursor-pointer" 
                        src={imageUrl} 
                        alt={name} 
                    />
                </div>
                {!inStock && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xl font-bold bg-red-500 px-4 py-2 rounded-md transform -rotate-12">OUT OF STOCK</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{categoryName}</div>
            </div>
            <div className="p-4">
                <h3 onClick={() => onNavigate('productDetail', product.id)} className="text-lg font-semibold text-gray-800 truncate cursor-pointer group-hover:text-blue-600 transition-colors duration-300">{name}</h3>
                <div className="flex items-center mt-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(parseFloat(rating))} />)}
                    </div>
                    <span className="text-gray-600 text-sm ml-2">{parseFloat(rating).toFixed(1)} stars</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-gray-900">₹{parseFloat(price).toFixed(2)}</span>
                    <button 
                        onClick={(e) => {
                         e.stopPropagation(); // Prevent navigation when clicking button
                        onAddToCart(product);
                            }} 
                        disabled={!inStock} 
                        className={`px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${inStock ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {inStock ? 'Add to Cart' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;