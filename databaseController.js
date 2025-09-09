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

const findUserByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const result = await pool.query('SELECT id, email, username FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export { register, findUserByEmail, findUserById };