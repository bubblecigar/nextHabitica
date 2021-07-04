import db from '../../../db/index.js'

const deleteFriendRow = async (requestor, acceptor) => {
  return new Promise((resolve, reject) => {
    db.query(`
      DELETE FROM friend
      WHERE requestor = $1 AND acceptor = $2
    `
      , [requestor, acceptor]
      , (err, dbRes) => {
        if (err) {
          console.log('deleteFriendRow err:', err)
          reject(err)
        } else {
          resolve(dbRes)
        }
      })
  })
}

export default async function deleteEat(req, res) {
  try {
    const { requestor, acceptor } = req.body
    await deleteFriendRow(requestor, acceptor)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
