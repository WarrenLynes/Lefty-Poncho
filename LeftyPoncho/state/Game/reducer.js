
export default function GameReducer(state = {}, {type, payload}) {
  switch(type) {
    case 'RECEIVE_GAME':
      return {
        id: payload.game_id,
        status: payload.status,
        players: payload.players,
        teams: payload.teams,

        bet: {
          amount: payload.bet_amount,
          rate: payload.bet_rate,
          type: {
           id: payload.bet_type_id,
            name: payload.bet_type_name,
            rules: payload.bet_type_rules,
          }
        },

        gameMaster: {
          id: payload.game_master_id,
          username: payload.game_master_username,
          first_name: payload.game_master_first_name,
          last_name: payload.game_master_last_name,
        },

        course: {
          id: payload.course_id,
          name: payload.course_name,
          num_holes: payload.course_num_holes,
        },

        hole: {
          id: payload.current_hole_id,
          num: payload.current_hole_num,
          par: payload.current_hole_par,
          distance: payload.current_hole_distance,
        },

        player: {
          game_player_id: payload.game_player_id,
          id: payload.player_id,
          username: payload.player_username,
          first_name: payload.player_first_name,
          last_name: payload.player_last_name,
          balance: payload.player_balance,
        },
      }

    default:
      return state;
  }
}