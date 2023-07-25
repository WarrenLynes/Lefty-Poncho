import Router from 'express-promise-router';
import {createUser, login} from "../controllers/user.controller";
import authenticate from "../middleware/authenticate";
import {deleteSession, updateSession} from "../controllers/session.controller";

export default function routes() {
  const router = new Router();

  router.get('/protected', authenticate, (req, res, next) => {
    console.log(req.user);
    res.send('protected');
  })

  router.post( '/signup', async (req, res, next) => {
    console.log(req.session);
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
      const user = await login({email, password});
      const session = await updateSession(req.session, user);

      res.cookie('leftyPoncho', session.id);
      res.send(user);
    } catch(err) {
      res.sendStatus(500);
    }
  });

  router.get('/logout', async (req, res, next) => {
    await deleteSession(req.session.id);
    res.clearCookie('leftyPoncho');
  });

  return router;
}