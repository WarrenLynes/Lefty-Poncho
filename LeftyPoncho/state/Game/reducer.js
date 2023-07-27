
export default function GameReducer(state = {}, {type, payload}) {
  switch(type) {

    case 'NEW_GAME':
      return {
        course_id: payload.course,
        bet_type: payload.bet_type,
        bet_amount: payload.bet_amount,
        current_hole_id: payload.current_hole_id,
        status: payload.status,
        game_master_id: payload.game_master_id,
        teams: payload.teams,
        scores: payload.scores,
        players: payload.players
      }

    default:
      return state;
  }
}