const { Pool } = require('pg')

export default function handler (req, res) {
  const pool = new Pool({
    user: 'postgres',
    host: '104.199.219.31',
    database: 'guest',
    password: '1234567',
    port: 5432
  })
  pool.query(`INSERT INTO entries (guestname, content)
  VALUES (${Math.random().toString()},${Math.random().toString()} );
  `, (err, res) => {
    console.log(err, res)
    pool.end()
  })
  res.send('aaa')
}
