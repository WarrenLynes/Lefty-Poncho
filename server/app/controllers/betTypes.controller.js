import {query} from "../db";

export function getAllBetTypes() {
  return query(`SELECT * FROM bet_type`).then((x) => x.rows);
}