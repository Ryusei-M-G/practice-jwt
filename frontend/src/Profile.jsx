import { useAuth } from "./AuthProvider"
import { useEffect, useState } from "react"
import axios from "axios"

const Profile = () => {
  const { isAuthenticated, token, login } = useAuth();
  const [state, setState] = useState({
    text1: '',
    text2: ''
  })
  const [message, setMessage] = useState('')

  // 401エラー時のリフレッシュ処理
  const handleTokenRefresh = async (retryCallback) => {
    try {
      const ref = await axios.get('http://localhost:3000/refresh', {
        withCredentials: true
      });
      const newAccessToken = ref.headers.authorization?.split(' ')[1];
      if (newAccessToken) {
        login(newAccessToken);
        return retryCallback();
      }
    } catch (refreshError) {
      console.error('リフレッシュトークンエラー:', refreshError);
      throw refreshError;
    }
  };


  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:3000/profile', {
        headers: {
          'Authorization': `Bearer ${token.current}`
        }
      });
      setState(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          return handleTokenRefresh(fetchProfile);
        } catch (refreshError) {
          return;
        }
      }
      console.error('認証エラー:', error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  }

  const updateProfile = async() => {
    const content = state;
    try {
      const res = await axios.post('http://localhost:3000/updateProfile', content, {
        headers: {
          'Authorization': `Bearer ${token.current}`
        }
      });
      setMessage('プロフィールを更新しました');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          return handleTokenRefresh(updateProfile);
        } catch (refreshError) {
          setMessage('更新に失敗しました');
          return;
        }
      }
      console.error('更新エラー:', error);
      setMessage('更新に失敗しました');
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {message && <div style={{ color: message.includes('成功') || message.includes('更新しました') ? 'green' : 'red', marginBottom: '10px' }}>{message}</div>}
      <button onClick={fetchProfile}>プロフィール情報取得</button>
      <div>
        情報1:<input name='text1' value={state.text1} style={{ fontSize: 24 }} onChange={handleChange} /> <br />
        情報2:<input name='text2' value={state.text2} style={{ fontSize: 24 }} onChange={handleChange} /> <br />
        <button onClick={updateProfile}>更新</button>
      </div>
    </div>
  );
}

export default Profile;