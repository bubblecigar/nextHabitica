const { Pool } = require('pg')
const pool = new Pool({
  user: 'bubblecigar',
  host: 'habitica.cecf6tg1nntq.ap-northeast-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'AAA9487946',
  port: 5432
})
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
