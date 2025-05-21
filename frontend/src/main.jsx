import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="722649163294-0ie6k6elumjm0q5f4mueog4qnkuiifi0.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
