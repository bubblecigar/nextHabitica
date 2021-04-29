import { useUser } from '../lib/hooks'

export default function Sleep (props) {
  const user = useUser({ redirectTo: '/' })
  return (
    <div>
      sleep
    </div>
  )
}
