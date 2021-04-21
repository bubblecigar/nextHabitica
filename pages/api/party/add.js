const { Pool } = require('pg')

export default async function handler (req, res) {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: 'postgres',
      host: '104.199.219.31',
      database: 'guest',
      password: '1234567',
      port: 5432
    })
    pool.query(`
        INSERT INTO entries (guestname, content)
        VALUES ('fifth', 'adlbouaeb')
        RETURNING *;
    `, (err, dbRes) => {
      const row = dbRes.rows[0]
      if (err) {
        // error handling
      } else {
        res.send(row)
      }
      pool.end()
      resolve()
    })
  })
}
