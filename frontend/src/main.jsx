import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import RegisterForm from "./RegisterForm";
import LoginForm from './LoginForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
