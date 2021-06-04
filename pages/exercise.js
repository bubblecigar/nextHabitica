import ExerciseRecord from '../components/exercise/ExerciseRecord'
import TrainingOptionList from '../components/exercise/TrainingOptionList'

export default function Exercise(props) {
  return (
    <div className='flex flex-col'>
      <TrainingOptionList />
    </div>
  )
}
