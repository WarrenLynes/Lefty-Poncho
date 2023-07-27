import {query} from "../db";

function parseData(options) {
  const wheres = Object.keys(options).map((x) => x + ' = ?');
  const whereValues = Object.values(options);
  return { string: wheres, values: whereValues }
}

function parseOptionsArray(column, options) {
  const wheres = ((x) => x + ' = ?');
  const whereValues = Object.values(options);
  return { string: wheres, values: whereValues }
}

export async function checkForOpenGames(users) {
  let string = users.map((x, i) => `user_id=$${i + 1}`);
  const openGames = await query(
    `SELECT COUNT(id) FROM game_player WHERE ${string.join(' OR ')}`,
    users
  ).then((x) => x.rows[0]);

  if(openGames.count > 0)
    throw new Error('open game');
}

export async function getActiveGame(userId) {
  return await query(
    `SELECT DISTINCT g.id, g.course_id, g.bet_type_id, g.bet_amount, g.bet_rate, g.current_hole_id, g.status, g.game_master_id
      FROM game g
      JOIN game_player gp ON g.id = gp.game_id
      JOIN "user" u ON gp.user_id = u.id
      WHERE u.id = $1
      AND g.status = 'inprogress'`,
    [userId]
  ).then((result) => result.rows);

}

async function getTeams(game_id, hole_id, selectString) {
  return query(
    `SELECT ${selectString} FROM team WHERE game_id=$1 AND hole_id = $2`,
    [game_id, hole_id]
  ).then((x) => x.rows);
}

function updateTeams(teams, leftTeam, rightTeam) {
  return Promise.all(teams.map(({id, team}) =>
    query(
      `UPDATE team 
        SET user_1_id = $1, user_2_id = $2
        WHERE id = $3 RETURNING *`,
      [
        team === 'left' ? leftTeam[0] : rightTeam[0],
        team === 'left' ? leftTeam[1] : rightTeam[1],
        id
      ]
    ).then((x) => x.rows[0])
  ))
}

function createTeams(game_id, hole_id, leftTeam, rightTeam) {
  const createTeam = (teamName, team) =>
    query(
      `INSERT INTO 
          team(game_id, team, hole_id, user_1_id, user_2_id)
          VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [game_id, teamName, hole_id, team[0], team[1]]
    );
  return Promise.all([
    createTeam('left', leftTeam),
    createTeam('right', rightTeam)
  ]);
}

export async function createGame(user, gameInfo) {

  try {
    const {course_id, bet_type_id, bet_amount, bet_rate, players} = gameInfo;
    const game_master_id = user.id;

    await checkForOpenGames([game_master_id, ...players]);

    const firstHoleId = await query(
      `SELECT id FROM hole WHERE course_id = $1 AND hole_num = 1`,
      [course_id]
    ).then((x) => x.rows[0].id);

    const newGame = await query(
      `INSERT INTO 
        game(course_id, bet_type_id, bet_amount, bet_rate, current_hole_id, game_master_id) 
        values($1, $2, $3, $4, $5, $6) RETURNING *`,
      [course_id, bet_type_id, bet_amount, bet_rate, firstHoleId, game_master_id]
    ).then((x) => x.rows[0]);

    const gamePlayers = await Promise.all([game_master_id, ...players].map((player) =>
      query(
        `INSERT INTO game_player(game_id, user_id) VALUES($1, $2) RETURNING *`,
        [newGame.id, player]
      ).then((x) => x.rows[0])
    ));

    return {firstHoleId, newGame, gamePlayers};

  } catch(err) {
    throw new Error(err);
  }
}

export function setTeams(game_id, hole_id, leftTeam, rightTeam) {
  return getTeams(game_id, hole_id, 'id, team')
    .then((result) => {
      if(result.length > 0) {
        return updateTeams(result, leftTeam, rightTeam)
      } else {
        return createTeams(game_id, hole_id, leftTeam, rightTeam);
      }
    }).then((x) => {
      console.log(x);
      return x;
    });
}

export async function getGameById(id) {
  return query(
    `SELECT * FROM game WHERE id=$1`,
    [game_id]
  ).then((x) => x.rows[0]);
}

export async function getHoleById(hole_id, selectColumns) {
  return query(
    `SELECT ${selectColumns} FROM hole WHERE id = $1`,
    [hole_id]
  ).then((x) => x.rows[0]);
}

export function submitScore(game_id, hole_id, user_id, score) {
  return query(
    `INSERT INTO 
        score(game_id, hole_id, user_id, score) 
        VALUES($1, $2, $3, $4) RETURNING id, user_id, score`,
    [game_id, hole_id, user_id, score]
  ).then((x) => x.rows[0]);
}


function calculateWinner(teams, scores, par) {
  let teamScores = teams.map((x, i) => {
    let birdie = false;
    let score = scores
      .filter((xx) => (xx.user_id === x.user_1_id) || (xx.user_id === x.user_2_id))
      .map(({score}) => {
        if(score < par) {
          birdie = true;
        }
        return score;
      })
      .sort((x, y) => x - y);
    return {
      team_id: x.id,
      score: score,
      birdie
    };
  });

  if(teamScores[0].birdie && !teamScores[1].birdie) {
    teamScores[1].score = Number(
      teamScores[1].score.sort((x,y) => y - x).join('')
    );
    teamScores[0].score = Number(
      teamScores[0].score.join('')
    );
  } else if(!teamScores[0].birdie && teamScores[1].birdie) {
    teamScores[0].score = Number(
      teamScores[0].score.sort((x,y) => y - x).join('')
    );
    teamScores[1].score = Number(
      teamScores[1].score.join('')
    )
  } else {
    teamScores[0].score = Number(
      teamScores[0].score.join('')
    )
    teamScores[1].score = Number(
      teamScores[1].score.join('')
    )
  }

  if(teamScores[0].score < teamScores[1].score) {
    teamScores[0]['winner'] = true;
  } else if (teamScores[1].score < teamScores[0].score) {
    teamScores[1]['winner'] = true;
  } else {
    teamScores[0]['winner'] = 'draw';
    teamScores[1]['winner'] = 'draw';
  }

  return teamScores;
}


export async function submitScores(game_id, hole_id, scores) {
  await query(
    `SELECT id FROM score WHERE game_id=$1 AND hole_id=$2`,
    [game_id, hole_id]
  ).then((x) => {
    if(x.rows.length)
      throw new Error('scores already inputed for this hole');
  });

  try {
    const hole = await getHoleById(hole_id, 'par');
    const teams = await getTeams(game_id, hole_id, 'id, team, user_1_id, user_2_id');

    const _scores = await Promise.all(
      scores.map(({user_id, score}) =>
        submitScore(game_id, hole_id, user_id, score)
      )
    );

    const teamScores = calculateWinner(teams, _scores, hole.par);

    await Promise.all(teamScores.map((ts) =>
      query(
        `UPDATE team SET victory = $1, draw=$2, score=$3 WHERE id = $4 RETURNING *`,
        [
          ts.winner === true,
          ts.winner === 'draw',
          ts.score,
          ts.team_id
        ]
      ).then((x) => x.rows)
    )).then((x) => {

      /*TODO UPDATE GAME HOLE */
      console.log(x);
    })

  } catch(err) {
    throw new Error(err);
  }
}