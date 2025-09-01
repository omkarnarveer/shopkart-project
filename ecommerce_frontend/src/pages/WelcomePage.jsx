import React from 'react';

// A simple SVG checkmark icon to make the page more visually appealing
const SuccessIcon = () => (
    <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WelcomePage = ({ user, onNavigate }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
                <SuccessIcon />
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome back, {user ? user.username : 'Guest'}!
                    </h2>
                    <p className="mt-2 text-gray-600">
                        You have successfully logged in.
                    </p>
                </div>
                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => onNavigate('home')}
                        className="w-full px-8 py-3 bg-blue-600 text-white font-bold rounded-full text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                    >
                        Continue Shopping
                    </button>
                    <div className="flex justify-center space-x-4">
                         <button
                            onClick={() => onNavigate('profile')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            View Order History
                        </button>
                         <button
                            onClick={() => onNavigate('products')}
                            className="text-sm font-medium text-gray-600 hover:text-gray-500"
                        >
                            Explore All Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;