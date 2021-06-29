import React, { Children } from 'react'
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useFoodOptions, useGroupByDateEat, useEat, useExercise } from '../../lib/hooks'
import { format } from 'date-fns-tz'
import zhTWLocale from 'date-fns/locale/zh-TW'
import DatePicker from '../DatePicker'
import SelectBox from '../SelectBox'
import DialogBox from '../DialogBox'
import { v4 as uuidv4 } from 'uuid'
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
