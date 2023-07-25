import  passport from 'passport';
import localStrategy from 'passport-local';
import {createUser, getUser} from "../controllers/user.controller";
import {validatePassword} from "./validatePassword";

passport.use(
  'signup',
  new localStrategy.Strategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async function(req, email, password, done) {
      try {
        const {username, first_name, last_name} = req.body;
        const user = await createUser({email, password, username, first_name, last_name});
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    }
  )
)

passport.use('login',
  new localStrategy.Strategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await getUser(email);
        if(!user)
          return done('no user', false, {message: 'user not found'});

        const validated = await validatePassword(user.password, password);

        if(!validated)
          return done('no user', false, {message: 'user not found'});

        return done(null, user, {message: 'log in success'});

      } catch(err) {
        return done(err);
      }
    }
  )
)






