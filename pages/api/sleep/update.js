import db from '../../../db/index.js'

const updateSleepRow = async (sleepId, start, end) => {
  return new Promise((resolve, reject) => {
    db.query(`
      UPDATE sleep
      SET start = $1, "end" = $2
      WHERE sleep_id = $3
    `
    , [new Date(start), new Date(end), sleepId]
    , (err, dbRes) => {
      if (err) {
        console.log('sleep/update err:', err)
        reject(err)
      } else {
        resolve(dbRes)
      }
    })
  })
}

export default async function update (req, res) {
  try {
    const { sleepId, start, end } = req.body
    await updateSleepRow(sleepId, start, end)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
