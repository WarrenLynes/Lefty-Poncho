import {query} from "../db";
import {rows} from "pg/lib/defaults";

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
  const openGames = await getActiveGame(users)

  if(openGames.length > 0) {
    await Promise.all(
      openGames.map((g) =>
        query(
          `DELETE FROM game WHERE id=$1`,
          [g.id]
        )
      )
    )
  }
}

export async function getGame(gameId, user) {
  console.log(gameId);
  const game = await query(
    `SELECT 
      g.id AS game_id,
      g.course_id,
      g.bet_amount,
      g.bet_rate,
      g.current_hole_id,
      g.bet_type_id,
      g.status,
      g.game_master_id,
      c.name AS course_name,
      c.num_holes AS course_num_holes,
      bt.name AS bet_type_name,
      bt.rules AS bet_type_rules,
      h.hole_num AS current_hole_num,
      h.par AS current_hole_par,
      h.distance AS current_hole_distance,
      gm.username AS game_master_username,
      gm.first_name AS game_master_first_name,
      gm.last_name AS game_master_last_name,
      gp.id AS game_player_id,
      gp.user_id AS player_id,
      u.username AS player_username,
      u.first_name AS player_first_name,
      u.last_name AS player_last_name,
      gp.balance AS player_balance
    FROM game g
    JOIN course c 
        ON g.course_id = c.id
    JOIN bet_type bt 
        ON g.bet_type_id = bt.id
    JOIN hole h 
        ON g.current_hole_id = h.id
    JOIN "user" gm 
        ON g.game_master_id = gm.id
    JOIN game_player gp 
        ON g.id = gp.game_id
    JOIN "user" u 
        ON gp.user_id = u.id
    WHERE g.id = $1 
        AND gp.user_id = $2;`,
    [gameId, user.id]
  ).then(({rows}) => rows[0]);

  const players = await getGamePlayers(game.game_id);
  const teams = await query(
    `SELECT * FROM team WHERE game_id=$1`,
    [game.game_id]
  ).then(({rows}) => rows);

  const _teams = {
    'left': null,
    'right': null
  };

  teams.forEach((team) => {
    _teams[team.team] = {
      ...team,
      players: players.filter((x) =>
        x.player_id === team.user_1_id
        || x.player_id === team.user_2_id
      )
    }
  });

  return {...game, players, teams: _teams};
}

export async function getActiveGameInfo(user) {
  const game = await query(
    `SELECT 
      g.id AS game_id,
      g.course_id,
      g.bet_amount,
      g.bet_rate,
      g.current_hole_id,
      g.bet_type_id,
      g.status,
      g.game_master_id,
      c.name AS course_name,
      c.num_holes AS course_num_holes,
      bt.name AS bet_type_name,
      bt.rules AS bet_type_rules,
      h.hole_num AS current_hole_num,
      h.par AS current_hole_par,
      h.distance AS current_hole_distance,
      gm.username AS game_master_username,
      gm.first_name AS game_master_first_name,
      gm.last_name AS game_master_last_name,
      gp.id AS game_player_id,
      gp.user_id AS player_id,
      u.username AS player_username,
      u.first_name AS player_first_name,
      u.last_name AS player_last_name,
      gp.balance AS player_balance
    FROM game g
    JOIN course c 
        ON g.course_id = c.id
    JOIN bet_type bt 
        ON g.bet_type_id = bt.id
    JOIN hole h 
        ON g.current_hole_id = h.id
    JOIN "user" gm 
        ON g.game_master_id = gm.id
    JOIN game_player gp 
        ON g.id = gp.game_id
    JOIN "user" u 
        ON gp.user_id = u.id
    WHERE g.status = 'inprogress' 
        AND gp.user_id = $1;`,
    [user.id]
  ).then(({rows}) => rows[0]);
  const players = await getGamePlayers(game.game_id);
  const teams = await query(
    `SELECT * FROM team WHERE game_id=$1`,
    [game.game_id]
  ).then(({rows}) => rows);

  const _teams = {
    'left': null,
    'right': null
  };

  teams.forEach((team) => {
    _teams[team.team] = {
      ...team,
      players: players.filter((x) =>
        x.player_id === team.user_1_id
        || x.player_id === team.user_2_id
      )
    }
  });

  return {...game, players, teams: _teams};
}

export async function getActiveGame(users) {
  let string = users.map((x, i) => `u.id=${x}`);
  return query(
    `SELECT DISTINCT g.id, g.course_id, g.bet_type_id, g.bet_amount, g.bet_rate, g.current_hole_id, g.status, g.game_master_id
      FROM game g
      JOIN game_player gp ON g.id = gp.game_id
      JOIN "user" u ON gp.user_id = u.id
      WHERE ${string.join(' OR ')} 
      AND g.status = 'inprogress'`
  ).then((result) => result.rows);
}

export async function getGamePlayers(gameId) {
  return query(
    `SELECT 
      gp.id AS game_player_id,
      gp.user_id AS player_id,
      u.username AS player_username,
      u.first_name AS player_first_name,
      u.last_name AS player_last_name,
      gp.balance AS player_balance
    FROM 
        game g
    JOIN 
        game_player gp ON g.id = gp.game_id
    JOIN 
        "user" u ON gp.user_id = u.id
    WHERE 
        g.id = $1;`,
    [gameId]
  ).then(({rows}) => rows)
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

    const gameTeams = await Promise.all([
      query(
        `INSERT INTO team(team, game_id, user_1_id, user_2_id) VALUES($1,$2,$3,$4)`,
        ['left', newGame.id, gamePlayers[0].user_id, gamePlayers[1].user_id]
      ),
      query(
        `INSERT INTO team(team, game_id, user_1_id, user_2_id) VALUES($1,$2,$3,$4)`,
        ['right', newGame.id, gamePlayers[2].user_id, gamePlayers[3].user_id]
      )
    ]);

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

export async function submitScore(game_id, hole_id, user_id, score) {
  return await query(
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


export async function submitScores(game_id, payload) {
  const {teams, course, hole} = payload;
  function getScore(players) {
    return Number(players.sort((a,b) => a - b).join(''));
  }

  try{
    const leftScore = getScore([teams.left.player_1, teams.left.player_1]);
    console.log(leftScore);

    const leftTeam = await query(
      `UPDATE team SET score=score + $1 WHERE id = $2 RETURNING *`,
      [(teams.left.player_1 + teams.left.player_2), teams.left.id]
    ).then(({rows}) => rows[0])
    const rightTeam = await query(
      `UPDATE team SET score=score + $1 WHERE id = $2 RETURNING *`,
      [(teams.right.player_1 + teams.right.player_2), teams.right.id]
    ).then(({rows}) => rows[0])

    if(hole.num < course.num_holes) {
      const nextHole = await query(
        `SELECT id FROM hole WHERE hole_num = $1 AND course_id =$2`,
        [hole.num + 1,  course.id]
      ).then(({rows}) => rows[0]);
      await query(
        `UPDATE game SET current_hole_id = $1 WHERE id = $2`,
        [nextHole.id, game_id]
      )
    } else {
      await query(
        `UPDATE game SET status= 'complete' WHERE id = $1`,
        [game_id]
      );

      let winner;
      console.log(leftTeam, rightTeam);
      if(leftTeam.score > rightTeam.score) {
        winner = rightTeam;
      } else if (leftTeam.score < rightTeam.score) {
        winner = leftTeam;
      } else {
        winner = 'draw';
      }

      await query(
        `UPDATE team SET victory = $1, draw=$2 WHERE id = $3 RETURNING *`,
        [
          winner.id === leftTeam.id,
          winner === 'draw',
          leftTeam.id
        ]
      ).then((x) => x.rows)

      await query(
        `UPDATE team SET victory = $1, draw=$2 WHERE id = $3 RETURNING *`,
        [
          winner.id === rightTeam.id,
          winner === 'draw',
          rightTeam.id
        ]
      ).then((x) => x.rows)
    }

  } catch(err) {
    console.error(err);
  }
  /*
  await query(
    `SELECT id FROM score WHERE game_id=$1 AND hole_id=$2`,
    [game_id, hole_id]
  ).then((x) => {
    if(x.rows.length)
      throw new Error('scores already inputed for this hole');
  });

  try{
    await query(
      `UPDATE team SET score=$1 WHERE id = $2`,
      [teams.left.score, teams.left.id]
    );
    await query(
      `UPDATE team SET score=$1 WHERE id = $2`,
      [teams.right.score, teams.right.id]
    );
  } catch(err) {
    console.error(err);
  }
  */


  /*try {
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

      /!*TODO UPDATE GAME HOLE *!/
      console.log(x);
    })

  } catch(err) {
    throw new Error(err);
  }*/
}