'use client';

import { useState } from 'react';
import Image from "next/image";

export default function Home()
{
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const handleChange = e =>
  {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e =>
  {
    e.preventDefault();
    const url = activeTab == 'login' ? '/api/login' : '/api/register';
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`w-1/2 py-2 text-center font-semibold ${activeTab === 'login' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`w-1/2 py-2 text-center font-semibold ${activeTab === 'signup' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {activeTab === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
}
