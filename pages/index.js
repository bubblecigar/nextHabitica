import { useUser } from '../lib/hooks'
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'

export default function Home (props) {
  const user = useUser()

  if (user === undefined) {
    return <div>loading...</div>
  } else if (user === null) {
    return (
      <>
        <SignupForm />
        <LoginForm />
      </>
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
