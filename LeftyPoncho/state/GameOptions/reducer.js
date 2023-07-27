
export default function GameOptionsReducer(state = {}, {type, payload}) {
  switch(type) {

    case 'RECEIVE_GAME_OPTIONS':
      return {
        courseOptions: payload.courses,
        playerOptions: payload.players,
        betOptions: payload.bet_types
      }

    default:
      return state;
  }
}