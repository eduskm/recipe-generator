import React from 'react';
import RecipeFinder from './RecipeFinder';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './Login';

function App() {
  return (
    <div>
      <RecipeFinder/>
      <Login/>
    </div>
  );
}

export default App;
