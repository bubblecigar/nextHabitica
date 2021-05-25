import db from '../../../../db/index.js'
import { getUserFromLoginSession } from '../../user'

const readUserFoodOptions = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT food_options FROM entries
      WHERE user_id = $1
    `
    , [userId]
    , (err, dbRes) => {
      if (err) {
        console.log('readUserFoodOptions err:', err)
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
    const dbRes = await readUserFoodOptions(user.user_id)
    res.status(200).send(dbRes.rows[0].food_options)
  } catch (error) {
    console.log('api/eat/options/read error:', error)
  }
}
