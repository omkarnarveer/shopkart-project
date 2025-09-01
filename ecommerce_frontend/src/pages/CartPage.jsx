import React from 'react';

// Define the base URL for your Django backend
const API_BASE_URL = 'http://127.0.0.1:8000';

const CartPage = ({ cart, onUpdateItem, onRemoveItem }) => {
    const cartItems = cart?.items || [];
    const subtotal = parseFloat(cart?.total_price || 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p className="text-center text-gray-600">Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {cartItems.map((item) => {
                            // THIS IS THE FIX: Construct the full image URL
                            const imageUrl = item.product.image
                                ? `${API_BASE_URL}${item.product.image}`
                                : 'https://placehold.co/80x80';

                            return (
                                <div key={item.id} className="flex items-center justify-between py-4 border-b">
                                    <div className="flex items-center">
                                        <img src={imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md mr-4"/>
                                        <div>
                                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                                            <p className="text-gray-500">₹{parseFloat(item.product.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {/* Quantity Controls */}
                                        <button onClick={() => onUpdateItem(item.id, 'remove')} className="bg-gray-200 text-gray-700 font-bold w-6 h-6 rounded-full">-</button>
                                        <p className="mx-4 font-semibold">{item.quantity}</p>
                                        <button onClick={() => onUpdateItem(item.id, 'add')} className="bg-gray-200 text-gray-700 font-bold w-6 h-6 rounded-full">+</button>
                                        {/* Remove Button */}
                                        <button onClick={() => onRemoveItem(item.id)} className="ml-6 text-red-500 hover:text-red-700">Remove</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-gray-100 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between mb-2"><span>Tax (10%)</span><span>₹{tax.toFixed(2)}</span></div>
                            <div className="border-t my-4"></div>
                            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                            <button className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600">Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;