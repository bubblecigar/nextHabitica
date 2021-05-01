import 'tailwindcss/tailwind.css'
import NavigationBar from '../components/NavigationBar'
import { useUser } from '../lib/hooks'

export default function App ({ Component, pageProps }) {
  useUser({ redirectTo: '/' })

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <NavigationBar />
      <Component {...pageProps} />
    </div>
  )
}
