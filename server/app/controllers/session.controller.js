import {v4} from "uuid";
import {query} from "../db";
import {hash} from "../util/hash";

export async function findSession(id) {
  const result = await query(
    `SELECT * FROM user_session WHERE id = $1`,
    [id]
  );

  return result.rows[0];
}

export async function createSession() {
  try {
    const result = await query(
      `INSERT INTO user_session(hash) VALUES($1) RETURNING *`,
      [hash(v4())]
    );

    return result.rows[0];
  } catch(err) {
    console.error(err);
  }
}

export async function updateSession(session, user) {
  try {
    session = await query(
      `UPDATE user_session SET user_id = $1 WHERE id = $2 RETURNING *`,
      [user.id, session.id]
    )
    return session.rows[0];
  } catch(err) {
    throw new Error(err);
  }
}

export async function deleteSession(session) {
  try {
    await query(
      `DELETE FROM user_session WHERE id = $1`,
      [session]
    )
    return;
  } catch(err) {
    throw new Error(err);
  }
}