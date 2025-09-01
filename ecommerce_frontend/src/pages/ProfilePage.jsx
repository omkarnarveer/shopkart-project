import React, { useState, useEffect } from 'react';

// This helper function should be defined in App.js and passed as a prop,
// or defined in a separate api.js file and imported.
const apiCall = async (endpoint, method = 'GET', body = null) => {
    const API_BASE_URL = 'http://127.0.0.1:8000';
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    };
    if (body) config.body = JSON.stringify(body);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An API error occurred');
    }
    return response.json();
};


const ProfilePage = ({ onNavigate }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const data = await apiCall('/api/order-history/');
                setOrders(data);
            } catch (err) {
                setError('Failed to load order history.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrderHistory();
    }, []);

    if (loading) return <div className="text-center py-20"><h2>Loading Order History...</h2></div>;
    if (error) return <div className="text-center py-20 text-red-500"><h2>{error}</h2></div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Order History</h1>
            {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4 border-b pb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                                    <p className="text-sm text-gray-500">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${parseFloat(order.total_paid).toFixed(2)}</p>
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{order.status}</span>
                                </div>
                            </div>
                            <div>
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between py-2">
                                        <p>{item.product.name} (x{item.quantity})</p>
                                        <p>${parseFloat(item.total_price).toFixed(2)}</p>
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

export default ProfilePage;