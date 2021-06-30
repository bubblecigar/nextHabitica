import db from '../../../db/index.js'
import { getUserFromLoginSession } from '../user'

const createExerciseRow = async (userId, training_table, exercise_id, time) => {
  return new Promise((resolve, reject) => {
    db.query(`
      INSERT INTO exercise(user_id, training_table, exercise_id, time)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
      , [userId, training_table, exercise_id, new Date(time)]
      , (err, dbRes) => {
        if (err) {
          console.log('exercise/create err:', err)
          reject(err)
        } else {
          resolve(dbRes.rows[0])
        }
      })
  })
}

export default async function create(req, res) {
  try {
    const user = await getUserFromLoginSession(req)
    const { training_table, exercise_id, time } = req.body
    const createdRow = await createExerciseRow(user.user_id, training_table, exercise_id, time)
    res.status(200).send({ done: true })
  } catch (error) {
    res.status(404).send({ done: false })
  }
}
