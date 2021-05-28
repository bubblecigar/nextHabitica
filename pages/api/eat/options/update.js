import db from '../../../../db/index.js'
import { getUserFromLoginSession } from '../../user'

const updateUserFoodOptions = async (userId, foodOptions) => {
  return new Promise((resolve, reject) => {
    db.query(`
      UPDATE entries
      SET food_options = $1
      WHERE user_id = $2
      RETURNING food_options
    `
    , [foodOptions, userId]
    , (err, dbRes) => {
      if (err) {
        console.log('updateUserFoodOptions err:', err)
        reject(err)
      } else {
        resolve(dbRes)
      }
    })
  })
}

export default async function update (req, res) {
  try {
    const user = await getUserFromLoginSession(req)
    const { foodOptions } = req.body
    const dbRes = await updateUserFoodOptions(user.user_id, foodOptions)
    res.status(200).send(dbRes.rows[0])
  } catch (error) {
    console.log('api/eat/options/update error:', error)
  }
}
