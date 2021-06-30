import 'tailwindcss/tailwind.css'
import '../styles/global.css'
import NavigationBar from '../components/NavigationBar'
import { useUser } from '../lib/hooks'

export default function App({ Component, pageProps }) {
  const user = useUser({ redirectTo: '/' })

  return (
    <div className='min-h-screen flex items-start justify-center bg-gray-50 py-28 px-4 sm:px-6 lg:px-8'>
      {user ? <NavigationBar /> : null}
      <Component {...pageProps} />
    </div>
  )
}
