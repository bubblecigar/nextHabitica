import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const createEatRow = async (userId, time, foods) => {
  return new Promise((resolve, reject) => {
    db.query(`
      INSERT INTO eat(user_id, foods, time)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    , [userId, foods, time]
    , (err, dbRes) => {
      if (err) {
        console.log('eat/create err:', err)
        reject(err)
      } else {
        resolve(dbRes.rows[0])
      }
    })
  })
}

export default async function create (req, res) {
  try {
    const user = await getUserFromLoginSession(req)
    const { time, foods } = req.body
    const createdRow = await createEatRow(user.user_id, time, foods)
    res.status(200).send({ done: true })
  } catch (error) {
    res.status(404).send({ done: false })
  }
}
