import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

//検証用のためハードコード
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

const register = async (mailaddress, username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username',
      [mailaddress, username, hashedPassword]
    );
    console.log(`register successfully.${username}`);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const findEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const findUsername = async (email) => {
  try {
    const result = await pool.query(
      'SELECT username FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0]
  } catch (error) {
    throw error;
  }
};


const login = async (email, password) => {
  try {
    const result = await pool.query(
      'SELECT password FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return false; // ユーザーが存在しない
    }
    
    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

export { register, findEmail,findUsername, login };