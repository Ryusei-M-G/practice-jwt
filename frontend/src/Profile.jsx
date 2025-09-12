import { useAuth } from "./AuthProvider"
import { useEffect, useState } from "react"
import axios from "axios"

const Profile = () => {
  const { isAuthenticated, token, login } = useAuth();
  const [state1,setState1] = useState('');
  const [state2,setState2] = useState('');


  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:3000/profile', {
        headers: {
          'Authorization': `Bearer ${token.current}`
        }
      });
      console.log(res.data)
      const {text1,text2} = res.data;
      setState1(text1);
      setState2(text2);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const ref = await axios.get('http://localhost:3000/refresh', {
            withCredentials: true
          });
          console.log(ref)
          const newAccessToken = ref.headers.authorization?.split(' ')[1];
          if (newAccessToken) {
            login(newAccessToken);
            return fetchProfile();
          }
        } catch (refreshError) {
          console.error('リフレッシュトークンエラー:', refreshError);
          return;
        }
      }
      console.error('認証エラー:', error);
    }
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={fetchProfile}>プロフィール情報取得</button>
      <div>情報1:{state1}</div>
      <div>情報2:{state2}</div>

    </div>
  );
}

export default Profile;