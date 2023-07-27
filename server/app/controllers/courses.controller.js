import {query} from "../db";

export function getAllCourses() {
  return query('SELECT * FROM course').then((x) => x.rows);
}