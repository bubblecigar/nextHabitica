import ExerciseRecord from '../components/exercise/ExerciseRecord'
import TrainingTableCreator from '../components/exercise/TrainingTableCreator'

export default function Exercise(props) {
  return (
    <div className='flex flex-col'>
      <TrainingTableCreator />
    </div>
  )
}
