import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const createSleepRow = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      INSERT INTO sleep(user_id)
      VALUES ($1)
      RETURNING *
    `
    , [userId]
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
