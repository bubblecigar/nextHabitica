import db from '../../../db/index.js'

const updateFriendRow = async (requestor, acceptor, accepted) => {
  return new Promise((resolve, reject) => {
    db.query(`
      UPDATE friend
      SET accepted = $1
      WHERE requestor = $2 AND acceptor = $3
    `
      , [accepted, requestor, acceptor]
      , (err, dbRes) => {
        if (err) {
          console.log('updateFriendRow err:', err)
          reject(err)
        } else {
          resolve(dbRes)
        }
      })
  })
}

export default async function update(req, res) {
  try {
    const { requestor, acceptor, accepted } = req.body
    await updateFriendRow(requestor, acceptor, accepted)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
