import { useState } from 'react';

const ChangePasswordForm = ({ email }) => {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
  });
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
      const res = await fetch('http://localhost:5000/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setForm({ current_password: '', new_password: '' });
      } else {
        setError(data.error || 'Failed to change password');
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
          <p className="text-green-500 text-sm text-center">Password changed successfully.</p>
        )}

        <div className="shadow-lg">
          <input
            type="password"
            name="current_password"
            placeholder="Current Password"
            value={form.current_password}
            onChange={handleChange}
            className="w-full p-5 text-gray-700 border-b border-gray-300 rounded-t-sm bg-transparent focus:outline-none focus:border-gray-600 transition-colors text-center"
          />
          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            value={form.new_password}
            onChange={handleChange}
            className="w-full p-5 text-gray-700 border-b border-gray-300 rounded-b-sm bg-transparent focus:outline-none focus:border-gray-600 transition-colors text-center"
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full p-3 mt-2 bg-blue-200 text-blue-800 font-semibold hover:bg-gray-50 transition-colors tracking-wide"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
