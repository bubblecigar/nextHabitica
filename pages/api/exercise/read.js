import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

export const readExerciseRows = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT * FROM exercise
      WHERE user_id = $1 AND time > current_date - interval '6 day'
      ORDER BY time DESC
    `
      , [userId]
      , (err, dbRes) => {
        if (err) {
          console.log('readExerciseRows err:', err)
          reject(err)
        } else {
          resolve(dbRes)
        }
      })
  })
}

export default async function read(req, res) {
  try {
    const user = await getUserFromLoginSession(req)
    const dbRes = await readExerciseRows(user.user_id)
    res.status(200).send(dbRes.rows)
  } catch (error) {
    console.log('api/exercise/read error:', error)
    res.status(500).end(error)
  }
}
