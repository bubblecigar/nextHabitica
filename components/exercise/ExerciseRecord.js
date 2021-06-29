import React from 'react'
import { useExercise } from '../../lib/hooks'
import TrainingTable from './TrainingTable'

const ExerciseRecord = () => {
  const exercises = useExercise()

  return exercises ? (
    exercises.map(
      exercise => (
        <TrainingTable key={exercise.exercise_id} staticValue={exercise.training_table} />
      )
    )
  ) : null
}

export default ExerciseRecord
