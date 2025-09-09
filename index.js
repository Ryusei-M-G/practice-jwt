import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { register } from './databaseController.js'

const app = express()
const port = 3000

app.use(cookieParser())
app.use(cors());
app.use(express.json());

const payload = { userId: 1 }
const JWT_SECRET = 'secret-key'
const REFRESH_SECRET = 'refresh-secret-key'

const auth = (req, res) => {
  const accessToken = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    accessToken,
    message: 'Tokens generated successfully'
  });
}


// JWT検証ミドルウェア
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (accessToken) {
    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
      if (err) {
        return handleRefreshToken(req, res, next);
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ message: 'Access token required' });
  }
};

// RefreshToken処理
const handleRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });
    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    req.user = decoded;
    next();
  });
};

const profile = (req, res) => {
  if (req.user.userId === 1) {
    res.json({ message: 'user1 secret message' });
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
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
app.get('/auth', auth);
app.get('/profile', verifyToken, profile);
app.post('/register', handleRegister);

app.get('/', (req, res) => {
  res.json({ message: 'hello world' });
})
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

