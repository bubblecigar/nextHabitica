import db from '../../../../db/index.js'
import { getUserFromLoginSession } from '../../user'

const readUserTrainingOptions = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT training_options FROM entries
      WHERE user_id = $1
    `
      , [userId]
      , (err, dbRes) => {
        if (err) {
          console.log('readUserTrainingOptions err:', err)
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
    const dbRes = await readUserTrainingOptions(user.user_id)
    res.status(200).send(dbRes.rows[0].food_options)
  } catch (error) {
    console.log('api/exercise/options/read error:', error)
  }
}
