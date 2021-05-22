import db from '../../../db/index.js'

const deleteEatRow = async (eatId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      DELETE FROM eat
      WHERE eat_id = $1
    `
    , [eatId]
    , (err, dbRes) => {
      if (err) {
        console.log('eat/delete err:', err)
        reject(err)
      } else {
        resolve(dbRes)
      }
    })
  })
}

export default async function deleteEat (req, res) {
  try {
    const { eatId } = req.body
    await deleteEatRow(eatId)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
