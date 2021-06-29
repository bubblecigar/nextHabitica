import ExerciseRecord from '../components/exercise/ExerciseRecord'
import TrainingTable from '../components/exercise/TrainingTable'

export default function Exercise(props) {
  return (
    <div className='flex flex-col'>
      <ExerciseRecord />
      <TrainingTable />
    </div>
  )
}
