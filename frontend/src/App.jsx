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

  return (
    <RecipeFinder/>
  );
}

export default App;
