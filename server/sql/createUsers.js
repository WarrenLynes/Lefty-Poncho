require('dotenv').config();
const bcrypt = require("bcrypt");
const {Pool} = require('pg');

const pool = new Pool();

async function query(text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  return res
}

const columns = [
  'email',
  'password',
  'username',
  'first_name',
  'last_name',
  'img_url'
];
const users = [
  ["warrenlynes@gmail.com","123456789","shaeffer","shay","lynes", "https://images.unsplash.com/photo-1593540537882-45954d30ec19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw1Mnx8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["coolsurfer@example.com","surf123","thecoolsurfer","Brody","Johnson", "https://images.unsplash.com/photo-1621369132713-4cfdb898dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw1M3x8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["fiercewarrior@example.com","warrior456","mightywarrior","Valentina","Smith", "https://images.unsplash.com/photo-1597369150710-64d6e1b61ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw1NHx8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["techgeek@example.com","geek789","techjunkie","Leo","Williams", "https://images.unsplash.com/photo-1593540482628-22ae28a654ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw1NXx8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["gamerchick@example.com","gamer321","gamequeen","Aria","Jones", "https://images.unsplash.com/photo-1631294933385-d670e775767d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw1Nnx8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["musiclover@example.com","love2jam","melodyaddict","Milo","Brown", "https://images.unsplash.com/photo-1623113807896-3b3a7fc2aec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw1N3x8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["wanderlust@example.com","roam789","travelbug","Stella","Davis", "https://images.unsplash.com/photo-1595827432953-7161e19e303e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw1OHx8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["foodieking@example.com","foodlover1","gourmetking","Harper","Miller", "https://images.unsplash.com/photo-1591491680738-eae9159fced6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw1OXx8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["bookworm@example.com","bookworm22","avidreader","Eli","Wilson", "https://images.unsplash.com/photo-1620911610351-158eda8cc5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw2MHx8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"],
  ["happysoul@example.com","happyday123","joyfulsoul","Amelia","Moore", "https://images.unsplash.com/photo-1627955806241-a7cf94780b1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0ODA3MTN8MHwxfHNlYXJjaHw2MXx8Z29sZmVyfGVufDB8fHx8MTY5MDQ0NTkyN3ww&ixlib=rb-4.0.3&q=80&w=200"]
].map((user) => {
  return {
    'email': user[0],
    'password': user[1],
    'username': user[2],
    'first_name': user[3],
    'last_name': user[4],
    'img_url': user[5],
  }
});

Promise.all(
  users.map(async ({email, password, username, first_name, last_name, img_url}) => {
    const hash = await bcrypt.hash(password, 10);
    return query(
      `INSERT INTO 
        "user"(email, password, username, first_name, last_name, img_url) 
        VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email, hash, username, first_name, last_name, img_url]
    ).then((x) => x.rows);
  })
).then((result) => {
  console.log(result)
})

