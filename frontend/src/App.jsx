import { useState ,useEffect} from "react"
import axios from 'axios'
import { useAuth } from "./AuthProvider"
function App() {

  const [isLoading, setIsLoading] = useState(false);
  const { token,login,isAuthenticated} = useAuth();
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


 
  const handleProf = async () => {
    console.log('token:',token.current)
    try {
      setIsLoading(true);
      
      const res = await axios.get('http://localhost:3000/profile', {
        headers: token.current ? {
          'Authorization': `Bearer ${token.current}`
        } : {},
        withCredentials: true
      });
      
      // 新しいアクセストークンがレスポンスヘッダーにある場合は更新
      const newAccessToken = res.headers.authorization?.split(' ')[1];
      if (newAccessToken) {
        login(newAccessToken);
      }
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