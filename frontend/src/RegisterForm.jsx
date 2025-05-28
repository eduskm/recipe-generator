import { useState } from 'react';
import React from 'react';

const RegisterForm = ({ onRegister }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        onRegister(); // optional: switch to login
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div className="w-90 mx-auto mt-15">
      <div className="space-y-6">
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-center">Account created! You can log in.</p>
        )}

        <div className="shadow-lg">
          <input 
            name="name" 
            placeholder="name" 
            value={form.name}
            onChange={handleChange} 
            className="w-full p-5 text-gray-700 border-b border-gray-300 rounded-t-sm bg-transparent focus:outline-none focus:border-gray-600 transition-colors text-center"
          />
          <input 
            name="email" 
            type="email"
            placeholder="email" 
            value={form.email}
            onChange={handleChange} 
            className="w-full p-5 text-gray-700 border-b border-gray-300 bg-transparent focus:outline-none focus:border-gray-600 transition-colors text-center"
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
          type="submit"
          onClick={handleSubmit}
          className="w-full p-3 mt-2 bg-green-200 text-green-800 font-semibold hover:bg-gray-50 transition-colors tracking-wide"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
