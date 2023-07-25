import {query} from '../db';
import bcrypt from "bcrypt";
import {validatePassword} from "../util/validatePassword";
import jwt from "jsonwebtoken";


export async function getUser(email) {
  try {
    const result = await query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );
    return result.rows[0];
  } catch(err) {
    throw Error(err);
  }
}

export async function createUser({email, password, username, first_name, last_name}) {
  if(!email || !password || !username || !first_name || !last_name)
    throw new Error('incomplete user info');

  const existingUser = await getUser(email);
  if(existingUser)
    throw new Error('user already exists');

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO 
        "user"(email, password, username, first_name, last_name) 
        VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [email, hash, username, first_name, last_name]
    );
    return result.rows[0];
  } catch(err) {
    throw new Error(err);
  }
}

export async function login({email, password}) {
  if(!email || !password)
    throw new Error('incomplete login info');

  const user = await getUser(email);

  if(!user)
    throw new Error('login error');

  await validatePassword(user.password, password);
  return {...user, token: jwt.sign(user, process.env.JWT_SECRET)};
}
