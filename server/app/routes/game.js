import Router from 'express-promise-router';
import {createGame, setTeams, submitScores} from "../controllers/game.controller";

export default function gameRoutes() {
  const router = new Router();

  router.post('/games', async (req, res, next) => {
    try {
      const result = await createGame(req.body);
      res.send(result);
    } catch(err) {
      next(err);
    }
  });

  router.post('/games/:game_id/holes/:hole_id/teams', async (req, res, next) => {
    try {
      const {game_id, hole_id} = req.params;
      const {leftTeam, rightTeam} = req.body;
      const teams = await setTeams(game_id, hole_id, leftTeam, rightTeam);
      res.send(teams);
    } catch(err) {
      res.sendStatus(500);
    }
  });

  router.post('/games/:game_id/holes/:hole_id/scores', async (req, res, next) => {
    try {
      const {game_id, hole_id} = req.params;
      const {scores} = req.body;
      const result = await submitScores(game_id, hole_id, scores);
      res.send(result);
    } catch(err) {
      next(err);
    }
  });

  return router;
}