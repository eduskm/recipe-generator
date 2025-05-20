const UserDashboard = ({ user, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl">Welcome, {user.name || user.email}!</h2>
      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
