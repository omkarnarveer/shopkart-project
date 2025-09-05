import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const OrderHistoryPage = ({ apiCall, onNavigate }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await apiCall('/api/orders/');
                setOrders(data);
            } catch (err) {
                setError("Failed to fetch order history. Please try again later.");
                console.error("Order fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [apiCall]);

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading your order history...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600 bg-red-100 p-6 rounded-lg">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-10">My Order History</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white p-10 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">No Orders Found</h2>
                    <p className="text-gray-600 mb-6">You haven't placed any orders with us yet.</p>
                    <button 
                        onClick={() => onNavigate('products')} 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
                                <div className="mb-4 sm:mb-0">
                                    <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
                                    <p className="text-sm text-gray-500">
                                        {/* FIX 1: Use `order.date_ordered` to match your Django model */}
                                        Placed on: {new Date(order.date_ordered).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-gray-600">Total Amount</p>
                                    <p className="font-bold text-xl text-gray-900">₹{parseFloat(order.total_price).toFixed(2)}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img 
                                                src={item.product.image ? `${API_BASE_URL}${item.product.image}` : 'https://placehold.co/80x80/cccccc/ffffff?text=No+Image'} 
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-md mr-4"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.product.name}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        {/* FIX 2: Use `item.product.price` to calculate the line item total */}
                                        <p className="font-semibold text-gray-800">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;