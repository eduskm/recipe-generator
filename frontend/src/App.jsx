import { useState, useEffect } from 'react';
import RecipeFinder from './RecipeFinder';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import UserDashboard from './UserDashboard';
import Login from './Login'; // Google Login

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (user) {
    return (
      <>
        <UserDashboard user={user} onLogout={() => setUser(null)} />
        <RecipeFinder />
      </>
    );
  }

  return (
    <div>
      {showRegister ? (
        <RegisterForm onRegister={() => setShowRegister(false)} />
      ) : (
        <LoginForm onLogin={setUser} />
      )}
      <div className="text-center mt-4">
        <button
          onClick={() => setShowRegister(!showRegister)}
          className="text-blue-600 underline"
        >
          {showRegister ? 'Already have an account? Log in' : 'No account? Register here'}
        </button>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm">Or use Google:</p>
        <Login />
      </div>
    </div>
  );
}

export default App;
