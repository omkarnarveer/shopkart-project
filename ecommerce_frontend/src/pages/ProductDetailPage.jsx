import React from 'react';

const ProductDetailPage = ({ productId, onAddToCart, onNavigate, onStockError, products }) => {
    const product = products.find(p => p.id === productId);

    if (!product) {
        return <div className="container mx-auto text-center py-20"><h2 className="text-2xl font-bold">Product not found!</h2></div>;
    }

    // Self-contained StarIcon to resolve the import error
    const StarIcon = ({ filled }) => (
        <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );

    const categoryName = typeof product.category === 'object' && product.category !== null
        ? product.category.name
        : product.category;

    const imageUrl = product.image || 'https://placehold.co/600x600/cccccc/ffffff?text=No+Image';

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="bg-white p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <img 
                            src={imageUrl} 
                            alt={product.name} 
                            className="w-full h-96 object-contain" 
                        />
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{categoryName}</span>
                        <h1 className="text-4xl font-bold text-gray-900 mt-4">{product.name}</h1>
                        <div className="flex items-center mt-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(parseFloat(product.rating))} />)}
                            </div>
                            <span className="text-gray-600 text-md ml-3">{parseFloat(product.rating).toFixed(1)} stars</span>
                        </div>
                        <p className="text-gray-600 mt-6 text-lg">{product.description}</p>
                        
                        <div className="mt-8">
                            <div className="mb-4">
                                <span className="text-4xl font-extrabold text-gray-900">₹{parseFloat(product.price).toFixed(2)}</span>
                            </div>
                            <div>
                                <button 
                                    // 2. UPDATE ONCLICK AND REMOVE `disabled` ATTRIBUTE
                                    onClick={() => product.in_stock ? onAddToCart(product) : onStockError()} 
                                    className={`w-auto inline-flex items-center justify-left px-6 py-3 rounded-lg text-white font-bold text-base transition-transform transform hover:scale-105 ${product.in_stock ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;