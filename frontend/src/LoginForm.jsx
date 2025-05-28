import { useState } from 'react';
import React from 'react';

const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Server error');
    }
  };



  return (
    <div className="w-90 mx-auto mt-20">
      <div className="space-y-6">
        
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        
        <div className="shadow-lg">
          <input 
            name="email" 
            type="email"
            placeholder="email" 
            value={form.email}
            onChange={handleChange} 
            className="w-full p-5 text-gray-700 border-b border-gray-300 rounded-t-sm bg-transparent focus:outline-none focus:border-gray-600 transition-colors text-center"
          />
          
          <input 
            type="password" 
            name="password" 
            placeholder="password" 
            value={form.password}
            onChange={handleChange} 
            className="w-full p-5 text-gray-700 border-b border-gray-300 rounded-b-sm bg-transparent focus:outline-none focus:border-gray-600 transition-colors text-center"
          />
        </div>
        
        <button 
          type="button"
          onClick={handleSubmit}
          className="w-full p-3 mt-2 bg-green-200 text-green-800 font-semibold hover:bg-gray-50 transition-colors tracking-wide"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;