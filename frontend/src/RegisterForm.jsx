import { useState } from "react"
import axios from "axios"

const RegisterForm = () => {
  const [state, setState] = useState({
    email: '',
    username: '',
    password: ''
  })

  const changeHandle = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const RegisterHandle = async () => {
    // バリデーション
    if (!state.email || !state.username || !state.password) {
      alert('すべての項目を入力してください');
      return;
    }

    const content = {
      mailaddress: state.email, 
      username: state.username,
      password: state.password
    }
    
    try {
      const res = await axios.post('http://localhost:3000/register', content);
      // stateをリセット
      setState({
        email: '',
        username: '',
        password: ''
      });
    } catch (err) {
      console.error('登録エラー:', err);
      alert('登録に失敗しました: ' + (err.response?.data?.message || err.message));
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
        name="username"
        placeholder="username"
        value={state.username}
        onChange={changeHandle}
      />
      <input
        name="password"
        placeholder="password"
        type="password"
        value={state.password}
        onChange={changeHandle}
      />

      <button onClick={RegisterHandle}>登録</button>
    </div>
  )
}

export default RegisterForm;