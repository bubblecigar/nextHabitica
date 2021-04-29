import { useUser } from '../lib/hooks'

export default function Exercise (props) {
  const user = useUser({ redirectTo: '/' })
  return (
    <div>
      exercise
    </div>
  )
}
