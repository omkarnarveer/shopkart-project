import React, { useState } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const LoginPage = ({ onLogin, onNavigate }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const response = await fetch(`${API_BASE_URL}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Login failed!');
        }
        
        // Correct: This simply passes the token up to App.js
        onLogin(data.access);

    } catch (err) {
        setError(err.message);
    }
};

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div><h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in</h2></div>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                    <div className="text-center">
                        <button type="button" onClick={() => onNavigate('register')} className="text-sm font-medium text-blue-600 hover:text-blue-500">Don't have an account? Register</button>
                    </div>
                    <div><button type="submit" className="w-full py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700">Sign in</button></div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;