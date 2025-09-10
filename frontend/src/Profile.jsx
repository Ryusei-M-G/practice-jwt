import { useAuth } from "./AuthProvider"

const Profile = () => {
  const { isAuthenticated, token } = useAuth();
  
  return (
    <div style={{textAlign:'center'}}>
      {isAuthenticated ? '認証済み':'未認証'}
    </div>
  );
}

export default Profile;