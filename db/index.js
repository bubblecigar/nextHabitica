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

// connect from client:
// psql "sslmode=disable dbname=guest user=postgres hostaddr=104.199.219.31"
