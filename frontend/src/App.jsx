import { useState } from "react"
import axios from 'axios'
function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const handleAuth = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:3000/auth');
      console.log(res);
      setAccessToken(res.data.accessToken);
    } catch (error) {
      console.error('認証エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleProf = async() =>{
    if (!accessToken) {
      alert('先に認証情報を取得してください');
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:3000/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log(res);
    } catch (error) {
      console.error('認証エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }

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
        <button onClick={handleAuth} style={buttonStyle}>
          認証情報取得
        </button>
        <button onClick={handleProf} style={buttonStyle}>
          Profile取得
        </button>
      </div>

      {isLoading && (
        <div style={{ 
          color: '#666', 
          fontSize: '14px',
          marginTop: '20px'
        }}>
          Loading...
        </div>
      )}
    </div>
  )
}

export default App