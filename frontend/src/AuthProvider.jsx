//Contextで認証状態とアクセストークンをグローバル管理
//トークンが必要なAPIはtokenから参照して使用
//tokenはレンダリングには関係ないためuseRef()

import { createContext, useContext, useState, useRef } from 'react'

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = useRef(null);

  const login = (accessToken) =>{
    token.current = accessToken;
    setIsAuthenticated(true);
  }
  const logout = () =>{
    token.current = '';
    setIsAuthenticated(false);
  }

  const value = {
    isAuthenticated,
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

