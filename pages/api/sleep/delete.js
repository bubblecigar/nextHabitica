import db from '../../../db/index.js'

const deleteSleepRow = async (sleepId) => {
  return new Promise((resolve, reject) => {
    db.query(`
      DELETE FROM sleep
      WHERE sleep_id = $1
    `
    , [sleepId]
    , (err, dbRes) => {
      if (err) {
        console.log('sleep/delete err:', err)
        reject(err)
      } else {
        resolve(dbRes)
      }
    })
  })
}

export default async function deleteSleep (req, res) {
  try {
    const { sleepId } = req.body
    await deleteSleepRow(sleepId)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
