import {signIn} from "../../utils/api";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const handleUserAuthenticated = ({user, token}) => ({
  type: 'USER_AUTHENTICATED',
  payload: {user, token}
});

export const handleSignIn = (email, password) => async (dispatch) => {
  signIn(email, password)
    .then(async ({data}) => {
      await AsyncStorage.setItem('AUTH', JSON.stringify(data))
      dispatch(handleUserAuthenticated(data));
    })
}