import db from '../../../db/index.js'

const updateExerciseRow = async (exerciseId, training, time) => {
  return new Promise((resolve, reject) => {
    db.query(`
      UPDATE exercise
      SET training = $1, time = $2
      WHERE exercise_id = $3
    `
      , [training, new Date(time), exerciseId]
      , (err, dbRes) => {
        if (err) {
          console.log('exercise/update err:', err)
          reject(err)
        } else {
          resolve(dbRes)
        }
      })
  })
}

export default async function update(req, res) {
  try {
    const { exerciseId, training, time } = req.body
    await updateExerciseRow(exerciseId, training, time)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
