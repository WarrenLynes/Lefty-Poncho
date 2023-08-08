import {handleSetLoading} from "../app/actions";
import {createGame, fetchActiveGame, fetchGame, submitScore} from "../../utils/api";



export function handleNewGame({course_id, bet_type_id, bet_amount, bet_rate, players}, cb) {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;

    handleSetLoading(true);

    createGame(token, {course_id, bet_type_id, bet_amount, bet_rate, players})
      .then(({data}) => {
        handleSetLoading(false);
        dispatch({
          type: 'RECEIVE_GAME',
          payload: data
        })
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        cb();
      })
  }
}

export function handleFetchGame() {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const gameId = state.game.id;

    handleSetLoading(true);

    fetchGame(token, gameId)
      .then(({data}) => {
        dispatch({
          type: 'RECEIVE_GAME',
          payload: data
        })
      }).catch((err) => {
      console.error(err);
    }).finally(() => {
      handleSetLoading(false)
    })
  }
}

export function handleFetchActiveGame() {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;

    handleSetLoading(true);

    fetchActiveGame(token)
      .then(({data}) => {
        dispatch({
          type: 'RECEIVE_GAME',
          payload: data
        })
      }).catch((err) => {
      console.error(err);
    }).finally(() => {
      handleSetLoading(false)
    })
  }
}

export function handleSubmitScore(payload) {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;

    handleSetLoading(true);

    submitScore(token, payload)
      .then(() => {
        dispatch(handleFetchGame())
      })
    .catch((err) => {
      console.error(err);
    }).finally(() => {
      handleSetLoading(false)
    })
  }
}