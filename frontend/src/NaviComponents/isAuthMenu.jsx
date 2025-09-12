const IsAuthMenu = ({username, navigate, logout}) => {
  return (
    <div>
      <button style={{ padding: 2 }} onClick={() => navigate('/')}>ホーム</button>
      <button style={{ padding: 2 }} onClick={() => navigate('/profile')}>プロフィール</button>
      <button onClick={() =>{logout();navigate('/')}}>ログアウト</button>
      <div style={{textAlign:"right"}}>{username}でログインしています。</div>
    </div>
  )
}

export default IsAuthMenu;