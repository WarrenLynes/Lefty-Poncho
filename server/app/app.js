import parseCookies from "./middleware/parseCookies";

require('dotenv').config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import methodOverride from 'method-override';
import sessionHandler from "./middleware/sessionHandlerr";
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import gameSetupRoutes from './routes/gameSetup';
import authenticate from "./middleware/authenticate";

export default function APP() {
  const app = express();
  app.set('port', process.env.PORT);

  // middlewares
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

  // session middleware
  // app.use(parseCookies, sessionHandler);

  // auth screens
  app.use(authRoutes());

  // protected screens
  app.get('/user', authenticate, (req, res) => {
    if(!req.user) {
      return res.sendStatus(401);
    }
    console.log(req.token);
    return res.send({user: req.user, token: req.token});
  });
  app.use(authenticate, gameRoutes());
  app.use(authenticate, gameSetupRoutes());

  app.listen(app.get('port'), function () {
    console.log('Listening on', app.get('port'));
  });

  app.use(methodOverride())
  app.use((err, req, res, next) => {
    console.error(err.stack)
    next(err)
  })
  app.use((err, req, res, next) => {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
  })
  app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({error: err})
  })

  return app;
};
