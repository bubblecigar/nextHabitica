import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'
import { findUser } from '../../../lib/user'

const createFriend = async (userId, acceptor) => {
  return new Promise((resolve, reject) => {
    db.query(`
      INSERT INTO friend(requestor, acceptor)
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
    const { acceptorName } = req.body
    const acceptor = await findUser({ username: acceptorName })
    const createdRow = await createFriend(user.user_id, acceptor.user_id)
    res.status(200).send({ done: true, createdRow })
  } catch (error) {
    res.status(404).send({ done: false, errorMessage: error.message })
  }
}
