import React, { useState } from 'react';

const CheckoutPage = ({ cart, onPlaceOrder }) => {
    const [processing, setProcessing] = useState(false);

    // Guard clause for an empty cart
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="text-center py-20 bg-white p-10 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
                <p className="text-gray-600">You can't proceed to checkout without any items.</p>
            </div>
        );
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const tax = subtotal * 0.10; // Example 10% tax
    const total = subtotal + tax;

    /**
     * Handles the form submission to simulate payment processing.
     * @param {React.FormEvent} e - The form event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        // Simulate a network request delay for 2 seconds
        setTimeout(() => {
            onPlaceOrder();
            // No need to set processing back to false, as the page will navigate away.
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Left Side: Payment and Shipping Form */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">Shipping & Payment Details</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
                            <input type="text" id="name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="John Doe" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="card">Card Number</label>
                            <input type="text" id="card" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="1234 5678 1234 5678" required />
                        </div>
                        <div className="flex gap-4 mb-6">
                            <div className="w-1/2">
                                <label className="block text-gray-700 mb-2" htmlFor="expiry">Expiry</label>
                                <input type="text" id="expiry" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="MM/YY" required />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-gray-700 mb-2" htmlFor="cvc">CVC</label>
                                <input type="text" id="cvc" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="123" required />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6">Your Order Summary</h2>
                    <div className="space-y-4">
                        {cart.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                                </div>
                                <span className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl mt-4 pt-2 border-t">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
