import {createSession,findSession} from "../controllers/session.controller";

export default async function sessionHandler(req, res, next) {
  let session_id = req.session_id;
  let session;

  if(session_id)
    session = await findSession(session_id);


  if(!session) {
    session = await createSession();
    session_id = session.id;
  }

  req.session = session;
  res.cookie('leftyPoncho', session_id);
  next();
}