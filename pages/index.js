import { useUser } from '../lib/hooks'

export default function Home (props) {
  const user = useUser({ redirectTo: '/login' })
  console.log('user:', user)
  return (
    <div>
      <main>
        index page
        currently logged in as { user?.user_name }
      </main>
    </div>
  )
}
