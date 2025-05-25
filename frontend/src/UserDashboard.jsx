import { useState } from 'react';
import Alert from './Alert';
import ChangePasswordForm from './ChangePasswordForm'; // 👈 Import the form

const UserDashboard = ({ user, onLogout }) => {
  const [showConfirm, setShowConfirm] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false); // 👈 New state

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  const handleDeleteAccount = () => {
    setShowConfirm('delete');
  };

  const confirmDelete = () => {
    localStorage.removeItem('user');
    onLogout();
    setShowConfirm(null);
  };

  const cancelDelete = () => {
    setShowConfirm(null);
  };

  const handleShowChangePassword = () => {
    setShowChangePassword(true); // 
  };

  const handleBack = () => {
    setShowChangePassword(false);
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

      <Alert action={showConfirm} confirmDelete={confirmDelete} cancelDelete={cancelDelete} />
    </div>
  );
};

export default UserDashboard;
