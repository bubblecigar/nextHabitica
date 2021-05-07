import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const createSleepRow = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      INSERT INTO sleep(user_id, start, "end")
      VALUES ($1, $2, $3)
      RETURNING *
    `
    , [userId, new Date(), new Date()]
    , (err, dbRes) => {
      if (err) {
        console.log('sleep/create err:', err)
        reject(err)
      } else {
        resolve(dbRes)
      }
    })
  })
}

export default async function create (req, res) {
  try {
    const user = await getUserFromLoginSession(req)
    await createSleepRow(user.user_id)
    res.status(200).send({ done: true })
  } catch (error) {

  }
}
