import React from 'react';

const OrderConfirmationPage = ({ onNavigate }) => {
    return (
        <div className="container mx-auto text-center py-20">
            <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg mx-auto">
                <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h1>
                <p className="text-xl text-gray-600 mb-6">Your order has been placed successfully.</p>
                <p className="text-gray-500">You will receive a confirmation email shortly.</p>
                <button
                    onClick={() => onNavigate('products')}
                    className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;