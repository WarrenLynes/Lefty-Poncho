import Router from 'express';

export default function routes() {
  const router = new Router();

  router.get('/hello', (req, res, next) => {
    res.send('hello there');
  });

  return router;
}