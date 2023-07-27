import {fetchGameOptions} from "../../utils/api";


const receiveOptions = (payload) => ({
  type: 'RECEIVE_GAME_OPTIONS',
  payload
})

export const handleFetchOptions = () => (dispatch, getState) => {

  const {auth} = getState();
  const {token} = auth;

  fetchGameOptions(token)
    .then(({data}) => {
      dispatch(receiveOptions(data));
    })
    .catch((err) => {
      console.error(err);
    })
}