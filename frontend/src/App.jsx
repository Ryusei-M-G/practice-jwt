import { useState, useEffect } from "react"
import axios from 'axios'
import { useAuth } from "./AuthProvider"
import { useNavigate } from 'react-router-dom'
function App() {
  const navigate = useNavigate()

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '40px',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '30px' }}>JWT Practice App</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => { navigate('/login') }} style={buttonStyle}>
          ログイン
        </button>
        <button onClick={() => { navigate('/register') }} style={buttonStyle}>
          登録
        </button>
      </div>
    </div>
  )
}

export default App