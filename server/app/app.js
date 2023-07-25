import parseCookies from "./middleware/parseCookies";

require('dotenv').config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import './util/passport';
import sessionHandler from "./middleware/sessionHandlerr";

export default function APP() {
  const app = express();

  app.set('port', process.env.PORT);
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

  app.use(parseCookies, sessionHandler);

  app.use(routes());


  app.listen(app.get('port'), function () {
    console.log('Listening on', app.get('port'));
  });

  return app;
};
