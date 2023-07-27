import {query} from "../db";

export function getAvailablePlayers(userId) {
  return query(
    `SELECT id, email, username, first_name, last_name, img_url
        FROM "user"
        WHERE id != $1 AND id NOT IN (
            SELECT DISTINCT gp.user_id
            FROM game_player gp
            INNER JOIN game g ON gp.game_id = g.id
            WHERE g.status = 'inprogress' OR g.status = 'setup'
        )`,
    [userId]
  ).then((x) => x.rows);
}