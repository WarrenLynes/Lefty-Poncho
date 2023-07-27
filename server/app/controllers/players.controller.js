import {query} from "../db";

export function getAvailablePlayers() {
  return query(
    `SELECT id, email, username, first_name, last_name
        FROM "user"
        WHERE id NOT IN (
            SELECT DISTINCT gp.user_id
            FROM game_player gp
            INNER JOIN game g ON gp.game_id = g.id
            WHERE g.status = 'inprogress' OR g.status = 'setup'
        )`
  ).then((x) => x.rows);
}