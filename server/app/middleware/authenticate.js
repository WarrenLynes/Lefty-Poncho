import jwt from "jsonwebtoken";

export default async function authenticate(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  const session = req.session;

  if(!req.session.user_id) {
    return res.sendStatus(401);
  }
  req.user = user;
  next();
}