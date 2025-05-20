import { useState } from 'react';

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
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow w-80 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input name="email" placeholder="Email" onChange={handleChange} className="block mb-2 w-full p-2 border rounded" />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="block mb-4 w-full p-2 border rounded" />
      <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">Login</button>
    </form>
  );
};

export default LoginForm;
