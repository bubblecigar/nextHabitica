import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const createFriend = async (userId, acceptor) => {
  return new Promise((resolve, reject) => {
    db.query(`
      INSERT INTO friend(user_id, acceptor)
      VALUES ($1, $2)
      RETURNING *
    `
      , [userId, acceptor]
      , (err, dbRes) => {
        if (err) {
          console.log('createFriend err:', err)
          reject(err)
        } else {
          resolve(dbRes.rows[0])
        }
      })
  })
}

export default async function create(req, res) {
  try {
    const user = await getUserFromLoginSession(req)
    const { acceptor } = req.body
    const createdRow = await createFriend(user.user_id, acceptor)
    res.status(200).send({ done: true })
  } catch (error) {
    res.status(404).send({ done: false })
  }
}
