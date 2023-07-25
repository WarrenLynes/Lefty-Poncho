require('dotenv').config();
import express from 'express';
import cors from 'cors';
import routes from 'routes';
import morgan from 'morgan';

export default function APP() {
  const app = express();
  app.set('port', process.env.PORT);
  app.use('dev');

  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());
  app.use(routes());

  app.listen(app.get('port'), function () {
    console.log('Listening on', app.get('port'));
  });

  return app;
};
