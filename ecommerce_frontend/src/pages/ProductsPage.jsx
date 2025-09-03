import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

// Self-contained Search Icon SVG for portability
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const ProductsPage = ({ onAddToCart, onNavigate, products, categories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(500);
    const [sortKey, setSortKey] = useState(''); // State to hold the current sort option
    

    // Calculate the maximum price from the products to set the slider's upper limit
    const maxPrice = useMemo(() => {
        if (!products || products.length === 0) return 500;
        return Math.ceil(Math.max(...products.map(p => parseFloat(p.price))));
    }, [products]);
    
    // Set initial price range to the max price only once when products load
    useEffect(() => {
        if (maxPrice > 0) {
            setPriceRange(maxPrice);
        }
    }, [maxPrice]);

    const handlePriceChange = (e) => {
        const value = Math.min(Number(e.target.value), maxPrice);
        setPriceRange(value);
    };

    // Filter and sort products based on the current state of the filters and sort key
    const processedProducts = useMemo(() => {
        let filtered = products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
            .filter(p => parseFloat(p.price) <= priceRange);

        // Apply sorting based on the sortKey
        switch (sortKey) {
            case 'price_asc':
                filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price_desc':
                filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'name_asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        return filtered;
    }, [products, searchTerm, selectedCategory, priceRange, sortKey]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
                    <h3 className="text-xl font-semibold mb-4">Filters</h3>
                    {/* Search Input */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </div>
                    </div>
                    {/* Category Buttons */}
                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Category</h4>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setSelectedCategory('All')} className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>All</button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedCategory === category.name ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Price Range Filter */}
                    <div>
                        <h4 className="font-semibold mb-2">Max Price: ₹{priceRange}</h4>
                        <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            value={priceRange}
                            onChange={handlePriceChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-600 text-sm">₹0</span>
                            <span className="text-gray-600 text-sm">₹{maxPrice}</span>
                        </div>
                    </div>
                </aside>
                {/* Product Grid */}
                <main className="lg:col-span-3">
                     <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-3xl font-bold text-gray-800">Our Products</h2>
                        <select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                            className="border rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Sort by Default</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="name_asc">Name: A to Z</option>
                            <option value="name_desc">Name: Z to A</option>
                        </select>
                    </div>
                    {processedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {processedProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onNavigate={onNavigate} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md"><p className="text-xl text-gray-500">No products match your criteria.</p></div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;

