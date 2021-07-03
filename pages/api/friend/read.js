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


const readUserInfo = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      SELECT user_name FROM entries
      WHERE user_id = $1
    `
      , [userId]
      , (err, dbRes) => {
        if (err) {
          console.log('readUserInfo err:', err)
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
    const promises = dbRes.rows.map(
      async row => {
        if (row.requestor === user.user_id) {
          const info = await readUserInfo(row.acceptor)
          return { ...row, info: info.rows[0] }
        } else {
          const info = await readUserInfo(row.requestor)
          return { ...row, info: info.rows[0] }
        }
      }
    )
    const result = await Promise.all(promises)
    res.status(200).send(result)
  } catch (error) {
    console.log('api/friend/read error:', error)
    res.status(500).end(error)
  }
}
