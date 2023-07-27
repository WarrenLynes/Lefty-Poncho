import {handleSetLoading} from "../app/actions";
import {createGame} from "../../utils/api";

export function handleNewGame({course_id, bet_type_id, bet_amount, game_master_id, players}) {
  return (dispatch, getState) => {
    handleSetLoading(true);

    createGame({course_id, bet_type_id, bet_amount, game_master_id, players})
      .then(({data}) => {
        dispatch({
          type: 'NEW_GAME',
          payload: data
        })
      }).catch((err) => {
        console.error(err);
        //dispatch(handleError(err));
      }).finally(() => {
        handleSetLoading(false)
      })
  }
}