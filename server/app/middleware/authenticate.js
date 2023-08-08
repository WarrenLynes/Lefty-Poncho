import jwt from "jsonwebtoken";

export default async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;
    req.token = token;
    next();
  } catch(err) {
    res.sendStatus(401);
  }
}