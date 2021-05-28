import db from '../../../db/index.js'

const updateEatRow = async (eatId, foods, time) => {
  return new Promise((resolve, reject) => {
    db.query(`
      UPDATE eat
      SET foods = $1, time = $2
      WHERE eat_id = $3
    `
    , [foods, new Date(time), eatId]
    , (err, dbRes) => {
      if (err) {
        console.log('eat/update err:', err)
        reject(err)
      } else {
        resolve(dbRes)
      }
    })
  })
}

export default async function update (req, res) {
  try {
    const { eatId, foods, time } = req.body
    await updateEatRow(eatId, foods, time)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
