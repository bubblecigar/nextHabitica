import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const readEatRows = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT * FROM eat
      WHERE user_id = $1
      ORDER BY time DESC
    `
    , [userId]
    , (err, dbRes) => {
      if (err) {
        console.log('readEatRows err:', err)
        reject(err)
      } else {
        resolve(dbRes)
      }
    })
  })
}

export default async function read (req, res) {
  try {
    const user = await getUserFromLoginSession(req)
    const dbRes = await readEatRows(user.user_id)
    res.status(200).send(dbRes.rows)
  } catch (error) {
    console.log('api/eat/read error:', error)
  }
}
