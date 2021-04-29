import { useUser } from '../lib/hooks'

export default function Eat (props) {
  const user = useUser({ redirectTo: '/' })
  return (
    <div>
      eat
    </div>
  )
}
