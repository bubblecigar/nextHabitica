import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const readUserFriends = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT * FROM friend
      WHERE requestor = $1 OR acceptor = $1
      ORDER BY created_at DESC
    `
      , [userId]
      , (err, dbRes) => {
        if (err) {
          console.log('readUserFriends err:', err)
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
    const dbRes = await readUserFriends(user.user_id)
    res.status(200).send(dbRes.rows)
  } catch (error) {
    console.log('api/friend/read error:', error)
    res.status(500).end(error)
  }
}
