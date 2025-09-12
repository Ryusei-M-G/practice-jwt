//Contextで認証状態とアクセストークンをグローバル管理
//トークンが必要なAPIはtokenから参照して使用
//tokenはレンダリングには関係ないためuseRef()

import { createContext, useContext, useRef, useState, useEffect } from 'react'

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const token = useRef(null);

  // JWTトークンをデコードする関数
  const decodeJWT = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  };

  const login = (accessToken) =>{
    token.current = accessToken;
    setIsAuthenticated(true);
    
    // トークンからusernameをデコード
    const payload = decodeJWT(accessToken);
    if (payload && payload.username) {
      setUsername(payload.username);
    }
  }
  const logout = () =>{
    token.current = '';
    setIsAuthenticated(false);
    setUsername(null);
    console.log('ログアウト')
  }

  const value = {
    isAuthenticated,
    username,
    token,
    login,
    logout,
  };

  return(
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;

