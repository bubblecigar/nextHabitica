import db from '../../../db/index.js'

const deleteExerciseRow = async (exercise_id) => {
  return new Promise((resolve, reject) => {
    db.query(`
      DELETE FROM exercise
      WHERE exercise_id = $1
    `
      , [exercise_id]
      , (err, dbRes) => {
        if (err) {
          console.log('exerciseId/delete err:', err)
          reject(err)
        } else {
          resolve(dbRes)
        }
      })
  })
}

export default async function deleteExercise(req, res) {
  try {
    const { exercise_id } = req.body
    await deleteExerciseRow(exercise_id)
    res.status(200).send({ done: true })
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
