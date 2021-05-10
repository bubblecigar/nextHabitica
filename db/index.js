const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: '104.199.219.31',
  database: 'guest',
  password: 'qwebnm',
  port: 5432
})
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
