import ExerciseRecord from '../components/exercise/ExerciseRecord'
import { TrainingTableCreator } from '../components/exercise/TrainingTable'

export default function Exercise(props) {
  return (
    <div className='flex flex-col items-center'>
      <ExerciseRecord />
      <TrainingTableCreator />
    </div>
  )
}
