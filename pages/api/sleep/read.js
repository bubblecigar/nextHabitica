import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const readSleepRows = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT * FROM sleep
      WHERE user_id = $1
    `
    , [userId]
    , (err, dbRes) => {
      if (err) {
        console.log('readSleepRows err:', err)
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
    const dbRes = await readSleepRows(user.user_id)
    res.status(200).send(dbRes.rows)
  } catch (error) {
    console.log('api/sleep/read error:', error)
  }
}
