const IsNotAuthMenu = ({navigate}) => {
  return (
    <div>
      <button style={{ padding: 2 }} onClick={() => navigate('/')}>ホーム</button>
      <button style={{ padding: 2 }} onClick={() => navigate('/login')}>ログイン</button>
      <button style={{ padding: 2 }} onClick={() => navigate('/register')}>登録</button>
    </div>
  )
}

export default IsNotAuthMenu;