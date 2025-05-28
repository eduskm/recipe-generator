import { useState } from 'react';
import Alert from './Alert';
import ChangePasswordForm from './ChangePasswordForm';
import React from 'react';

const UserDashboard = ({ user, onLogout }) => {
  const [showConfirm, setShowConfirm] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  const handleDeleteAccount = () => {
    setShowConfirm('delete'); // This will trigger the Alert modal
  };

  // This function is now async and accepts the password from the Alert component
  const confirmDelete = async (password) => {
    try {
      const response = await fetch('http://localhost:5000/delete_account', { // Make sure the proxy is set up in package.json or use the full URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: password, // Send the email and password
        }),
      });

      if (response.ok) {
        // If deletion is successful on the backend...
        localStorage.removeItem('user'); // ...log the user out on the frontend
        onLogout();
        setShowConfirm(null);
        return true; // Indicate success
      } else {
        // If credentials fail or another error occurs
        console.error('Failed to delete account');
        return false; // Indicate failure
      }
    } catch (error) {
      console.error('Error during account deletion:', error);
      return false; // Indicate failure
    }
  };

  const cancelDelete = () => {
    setShowConfirm(null);
  };

  const handleShowChangePassword = () => {
    setShowChangePassword(true);
  };

  if (showChangePassword) {
    return (
      <div className="text-center">
        <ChangePasswordForm email={user.email} />
      </div>
    );
  }

  return (
    <div className="relative text-center mt-10 font-semibold">
      <h2 className="text-2xl">welcome, {user.name || user.email}!</h2>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        logout
      </button>

      <button
        onClick={handleDeleteAccount}
        className="mt-4 ml-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        delete account
      </button>

      <button
        onClick={handleShowChangePassword}
        className="mt-4 ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        change password
      </button>

      {/* Pass the correct props to the Alert component */}
      <Alert
        action={showConfirm}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
        email={user.email}
      />
    </div>
  );
};

export default UserDashboard;