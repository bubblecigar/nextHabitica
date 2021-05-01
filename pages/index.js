import { useUser } from '../lib/hooks'
import AccountForm from '../components/AccountForm'

export default function Home (props) {
  const user = useUser()

  if (user === undefined) {
    return <div>loading...</div>
  } else if (user === null) {
    return (
        <AccountForm />
    )
  } else {
    return (
      <>
        <div>currently login as { user?.user_name }</div>
        <a href='/api/logout'>logout</a>
      </>
    )
  }
}
