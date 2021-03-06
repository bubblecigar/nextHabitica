import React from 'react'
import { useExercise } from '../../lib/hooks'
import TrainingTable from './TrainingTable'

const ExerciseRecord = ({ exercises = useExercise(), editable = true }) => {

  return exercises ? (
    exercises.map(
      exercise => (
        <TrainingTable
          key={exercise.exercise_id}
          exercise_id={exercise.exercise_id}
          staticValue={{ ...exercise.training_table, time: new Date(exercise.time) }}
          editable={editable}
        />
      )
    )
  ) : null
}

export default ExerciseRecord
