import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import IsAuthMenu from './NaviComponents/isAuthMenu';
import IsNotAuthMenu from './NaviComponents/isNotAuthMenu';
const Navi = () => {
  const { token, isAuthenticated, logout, username } = useAuth();
  const navigate = useNavigate()

  return (
    <div style={{ padding: 2 }}>
      {isAuthenticated ? <IsAuthMenu username={username} navigate={navigate} logout={logout}/> :<IsNotAuthMenu navigate={navigate} />}
      
    </div>
  )
}

export default Navi;