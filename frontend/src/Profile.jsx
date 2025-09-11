import { useAuth } from "./AuthProvider"
import { useEffect } from "react"
import axios from "axios"

const Profile = () => {
  const { isAuthenticated, token } = useAuth();


  const fetchProfile = async () => {
    try {
      
      const res = await axios.get('http://localhost:3000/profile', {
        headers: {
          'Authorization': `Bearer ${token.current}`
        }
      });
      console.log(res);
    } catch (error) {
      console.error('認証エラー:', error);
    }
  }
  return (
    <div style={{ textAlign: 'center' }}>
      {isAuthenticated ? '認証済み' : '未認証'}
      <button onClick={fetchProfile}>プロフィール情報取得</button>
    </div>
  );
}

export default Profile;