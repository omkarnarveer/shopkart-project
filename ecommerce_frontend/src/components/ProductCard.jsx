import React from 'react';

// A simple placeholder for the StarIcon, as it's not provided.
const StarIcon = ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ProductCard = ({ product, onAddToCart, onNavigate, onStockError }) => {
    // Destructure all needed properties, including 'quantity'
    const { name, category, price, rating, quantity, image } = product;
    
    // Use quantity as the single source of truth for stock status.
    const isOutOfStock = quantity === 0;
    
    const imageUrl = image || 'https://placehold.co/400x400/cccccc/ffffff?text=No+Image';
    const categoryName = typeof category === 'object' && category !== null ? category.name : category;

    /**
     * Handles the click event on the button.
     * Calls the correct function based on the stock status.
     */
    const handleButtonClick = (e) => {
        e.stopPropagation(); // Prevent navigation when the button is clicked.
        
        if (!isOutOfStock) {
            onAddToCart(product);
        } else {
            // FIX: Add a check to prevent crashing if the onStockError prop isn't passed.
            if (typeof onStockError === 'function') {
                onStockError(); 
            } else {
                // This console error helps developers find the root cause.
                console.error("onStockError was called, but it is not a function. Make sure you are passing it as a prop to ProductCard.");
            }
        }
    };

    return (
        // The empty class for isOutOfStock keeps the card colored.
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 group ${isOutOfStock ? '' : ''}`}>
            <div className="relative">
                <div className="p-4 bg-gray-50">
                    <img 
                        onClick={() => onNavigate('productDetail', product.id)} 
                        className="w-full h-48 object-contain cursor-pointer" 
                        src={imageUrl} 
                        alt={name} 
                    />
                </div>
                
                {/* Out of Stock Overlay - now controlled by isOutOfStock */}
                {isOutOfStock && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xl font-bold bg-red-500 px-4 py-2 rounded-md transform -rotate-12">OUT OF STOCK</span>
                    </div>
                )}
                
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{categoryName}</div>
            </div>
            
            <div className="p-4 flex flex-col justify-between h-48">
                <div>
                    <h3 onClick={() => onNavigate('productDetail', product.id)} className="text-lg font-semibold text-gray-800 truncate cursor-pointer group-hover:text-blue-600 transition-colors duration-300">{name}</h3>
                    
                    <div className="flex items-center mt-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(parseFloat(rating))} />)}
                        </div>
                        <span className="text-gray-600 text-sm ml-2">{parseFloat(rating).toFixed(1)} stars</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-gray-900">₹{parseFloat(price).toFixed(2)}</span>
                    <button 
                        onClick={handleButtonClick}
                        className={`px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                            isOutOfStock 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;