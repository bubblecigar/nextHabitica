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
      SELECT * FROM entries
    `, (err, dbRes) => {
      const rows = dbRes.rows
      if (err) {
        // error handling
      } else {
        res.send(rows)
      }
      pool.end()
      resolve()
    })
  })
}
