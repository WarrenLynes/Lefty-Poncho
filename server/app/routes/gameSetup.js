import Router from 'express-promise-router';
import {getAvailablePlayers} from "../controllers/players.controller";
import {getAllCourses} from "../controllers/courses.controller";
import getGameOptions from "../controllers/gameSetup.controller";

export default function gameSetupRoutes() {
  const router = new Router();

  router.get('/game-options', async (req, res, next) => {
    try {
      const options = await getGameOptions(req.user.id);
      res.send(options);
    } catch(err) {
      next(err);
    }
  });

  router.get('/available-players', async (req, res, next) => {
    try {
      console.log('req.user', req.user);
      const userId = req.user.id;
      const players = await getAvailablePlayers(userId);
      res.send(players);
    } catch(err) {
      next(err);
    }
  });

  router.get('/courses', async (req, res, next) => {
    try {
      const courses = await getAllCourses();
      res.send(courses);
    } catch(err) {
      next(err);
    }
  });


  return router;
}