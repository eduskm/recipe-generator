import { useState } from 'react';

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
    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        onRegister(); // poți comuta spre login
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow w-80 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Account created! You can log in.</p>}
      <input name="name" placeholder="Name" onChange={handleChange} className="block mb-2 w-full p-2 border rounded" />
      <input name="email" placeholder="Email" onChange={handleChange} className="block mb-2 w-full p-2 border rounded" />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="block mb-4 w-full p-2 border rounded" />
      <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600">Register</button>
    </form>
  );
};

export default RegisterForm;
