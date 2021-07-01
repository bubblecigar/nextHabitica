import { useUser } from '../lib/hooks'
import AccountForm from '../components/AccountForm'
import FriendList from '../components/friend/FriendList'

export default function Home(props) {
  const user = useUser()

  if (user === undefined) {
    return <div>loading...</div>
  } else if (user === null) {
    return (
      <AccountForm />
    )
  } else {
    return (
      <FriendList />
    )
  }
}
