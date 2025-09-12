import { useState } from "react"
import axios from "axios"
import { useAuth } from "./AuthProvider"
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [state, setState] = useState({
    email: '',
    password: ''
  })

  const changeHandle = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const LoginHandle = async () => {
    // バリデーション
    if (!state.email || !state.password) {
      alert('すべての項目を入力してください');
      return;
    }

    const content = {
      mailaddress: state.email,
      password: state.password
    }

    try {
      const res = await axios.post('http://localhost:3000/login', content,{
        withCredentials:true//RT取得のためtrue
      });
      const Accesstoken = res.headers.authorization?.split(' ')[1];
      if (Accesstoken) {
        login(Accesstoken);
      }

      // stateをリセット
      setState({
        email: '',
        password: ''
      });
      console.log('認証成功:', res.data.message);
      //画面遷移
      navigate('/profile');
    } catch (err) {
      console.error('認証エラー', err);
    }
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <input
        name="email"
        placeholder="email"
        value={state.email}
        onChange={changeHandle}
      />
      <input
        name="password"
        placeholder="password"
        type="password"
        value={state.password}
        onChange={changeHandle}
      />

      <button onClick={LoginHandle}>ログイン</button>
    </div>
  )
}

export default LoginForm;