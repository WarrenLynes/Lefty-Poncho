import {getAvailablePlayers} from "./players.controller";
import {getAllCourses} from "./courses.controller";
import {getAllBetTypes} from "./betTypes.controller";


export default function getGameOptions(userId) {
  return Promise.all([
    getAllCourses(),
    getAvailablePlayers(userId),
    getAllBetTypes()
  ]).then((result) => ({
    courses: result[0],
    players: result[1],
    bet_types: result[2]
  }))
}