import Router from 'express-promise-router';
import {createUser, login} from "../controllers/user.controller";
import {deleteSession, updateSession} from "../controllers/session.controller";

export default function authRoutes() {
  const router = new Router();

  router.post( '/signup', async (req, res, next) => {
    try{
      await createUser(req.body);
      res.sendStatus(201);
    } catch(err) {
      res.sendStatus(500);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const {email, password} = req.body;
      const {user, token} = await login({email, password});
      /*let session = req.session;

      if(!req.session.user_id) {
        session = await updateSession(req.session, user);
      }

      res.cookie('leftyPoncho', session.id);*/
      res.send({user, token});
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  router.get('/logout', async (req, res, next) => {
    await deleteSession(req.session.id);
    res.clearCookie('leftyPoncho');
  });

  return router;
}