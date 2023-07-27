import {signIn} from "../../utils/api";


export const handleUserAuthenticated = ({user, token}) => ({
  type: 'USER_AUTHENTICATED',
  payload: {user, token}
});

export const handleSignIn = (email, password) => (dispatch) => {
  signIn(email, password)
    .then(({data}) => {
      dispatch(handleUserAuthenticated(data));
    })
}