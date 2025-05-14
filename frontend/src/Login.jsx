import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const handleLoginSuccess = (response) => {
    const token = response.credential;
    // Trimite token-ul la backend pentru a-l verifica
    fetch('http://localhost:5000/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Logged in successfully:', data);
        // Redirecționează utilizatorul către dashboard sau o altă pagină
      })
      .catch((error) => console.log('Error logging in:', error));
  };

  const handleLoginFailure = (error) => {
    console.log('Login Failed:', error);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
      />
    </div>
  );
};

export default Login;
