import {getAvailablePlayers} from "./players.controller";
import {getAllCourses} from "./courses.controller";
import {getAllBetTypes} from "./betTypes.controller";


export default function getGameOptions() {
  return Promise.all([
    getAllCourses(),
    getAvailablePlayers(),
    getAllBetTypes()
  ]).then((result) => ({
    courses: result[0],
    players: result[1],
    bet_types: result[2]
  }))
}