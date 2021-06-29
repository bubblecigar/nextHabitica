import db from '../../../db/index.js'

const updateExerciseRow = async (exercise_id, training_table) => {
  return new Promise((resolve, reject) => {
    db.query(`
      UPDATE exercise
      SET training_table = $1
      WHERE exercise_id = $2
    `
      , [training_table, exercise_id]
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
    const { exercise_id, training_table } = req.body
    await updateExerciseRow(exercise_id, training_table)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
