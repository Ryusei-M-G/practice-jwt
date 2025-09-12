import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { register, findEmail,findUsername, login } from './databaseController.js'

const app = express()
const port = 3000

app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Authorization']
}));
app.use(express.json());


const JWT_SECRET = 'secret-key'
const REFRESH_SECRET = 'refresh-secret-key'

const auth = async (req, res) => {
  const { mailaddress, password } = req.body;
  try {
    const email = await findEmail(mailaddress);
    const user = await findUsername(mailaddress);
    const auth = await login(mailaddress, password);
    if(!auth){
      return res.status(401).json({message:'Invalid credentials'});
    }

    const payload = {username:user.username}
    const accessToken = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1m' }
    );

    const refreshToken = jwt.sign(
      payload,
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[${new Date().toLocaleString()}] === ログイン成功 ===`);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    console.log(`[${new Date().toLocaleString()}] Cookie設定完了`);

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.json({
      message: 'Tokens generated successfully'
    });

  } catch (err) {
    throw err;
  }

}


// JWT検証ミドルウェア
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(' ')[1];
  
  console.log(`[${new Date().toLocaleString()}] === verifyToken ===`);
  if (accessToken) {
    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(`[${new Date().toLocaleString()}] アクセストークン検証失敗:`, err.message);
        return res.status(401).json({ message: 'Access token invalid' });
      }
      req.user = decoded;
      next();
    });
  } else {
    console.log(`[${new Date().toLocaleString()}] アクセストークンなし`);
    return res.status(401).json({ message: 'Access token required' });
  }
};

// RefreshTokenエンドポイント
const refreshEndpoint = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  console.log(`[${new Date().toLocaleString()}] === refreshEndpoint ===`);

  if (!refreshToken) {
    console.log(`[${new Date().toLocaleString()}] リフレッシュトークンなし`);
    return res.status(401).json({ message: 'Refresh token required' });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) {
      console.log(`[${new Date().toLocaleString()}] リフレッシュトークン検証失敗:`, err.message);
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    console.log(`[${new Date().toLocaleString()}] リフレッシュトークン検証成功:`, decoded);
    const newAccessToken = jwt.sign({ username: decoded.username }, JWT_SECRET, { expiresIn: '15m' });
    console.log(`[${new Date().toLocaleString()}] 新しいアクセストークン生成`);
    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    res.json({ message: 'Token refreshed successfully' });
  });
};

const profile = (req, res) => {
  res.json({
    text1: 'hoge',
    text2: 'fuga',
  }
  )
}

const handleRegister = async (req, res) => {
  const { mailaddress, username, password } = req.body;
  try {
    const user = await register(mailaddress, username, password);
    res.status(201).json({ message: 'Successfully registered', user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
}
//エンドポイント
app.post('/login', auth);
app.get('/profile', verifyToken, profile);
app.post('/register', handleRegister);
app.get('/refresh', refreshEndpoint);

app.get('/', (req, res) => {
  res.json({ message: 'hello world' });
})
app.listen(port, () => {
  console.log(`[${new Date().toLocaleString()}] Server running at http://localhost:${port}`)
})

