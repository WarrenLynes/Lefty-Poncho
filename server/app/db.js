require('dotenv').config();
import {Pool} from 'pg';

const pool = new Pool();

export async function query(text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  return res
}