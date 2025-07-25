'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);
  setMessage('');
  const endpoint = mode === 'login' ? '/api/login' : '/api/register';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      setMessage(data.message || data.error || 'Login failed.');
    } else {
      setMessage(mode === 'login' ? 'Login successful! Redirecting to dashboard' : 'Registration successful!');
      resetForm();

      
      setTimeout(() => {
        if (data.role === 'admin') {
          router.push('/admin');
        } else if (data.role === 'user') {
          router.push('/user');
        }
      }, 1200); 
    }
  } catch (error) {
    console.error(error);
    setMessage('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2">
      
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-extrabold mb-2 tracking-wide">
            {mode === 'login' ? 'Welcome Back!' : 'Hello, Friend!'}
          </h2>
          <p className="text-sm mb-6 text-white/80 text-center max-w-xs">
            {mode === 'login'
              ? 'Login to access your dashboard and manage your account.'
              : 'Create your account to get started with our services.'}
          </p>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              resetForm();
              setMessage('');
            }}
            className="bg-white text-blue-700 px-6 py-2 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Switch to {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </div>

        <div className="p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {mode === 'login' ? 'Login to Your Account' : 'Create Your Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition font-semibold ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>

         {message && (
          <p
            className={`mt-4 text-sm text-center ${
              message.toLowerCase().includes('successful') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        </div>
      </div>
    </div>
  );
}
