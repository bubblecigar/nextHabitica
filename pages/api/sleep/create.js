import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const createSleepRow = async (userId, start, end) => {
  return new Promise((resolve, reject) => {
    db.query(`
      INSERT INTO sleep(user_id, start, "end")
      VALUES ($1, $2, $3)
      RETURNING *
    `
    , [userId, new Date(start), new Date(end)]
    , (err, dbRes) => {
      if (err) {
        console.log('sleep/create err:', err)
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
    const { start, end } = req.body
    const createdRow = await createSleepRow(user.user_id, start, end)
    res.status(200).send({ done: true, sleepId: createdRow.sleep_id })
  } catch (error) {

  }
}
