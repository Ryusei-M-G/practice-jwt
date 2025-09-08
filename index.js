import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()
const port = 3000

const payload = { userId: 1}
const JWT_SECRET = 'secret-key'

const auth = (req, res) => {
  const token = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
}

app.get('/', (req, res) => {
  res.json({message:'hello world'});
})

app.get('/auth',auth);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

