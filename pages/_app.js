import 'tailwindcss/tailwind.css'
import Link from 'next/link'
import { useUser } from '../lib/hooks'

export default function App ({ Component, pageProps }) {
  const user = useUser({ redirectTo: '/' })
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='fixed left-0 top-0'>
        <Link href='/'>Account</Link>
        {
          user
            ? (
              <>
                <Link href='/sleep'>sleep</Link>
                <Link href='/eat'>eat</Link>
                <Link href='/exercise'>exercise</Link>
              </>
            )
            : null
        }
      </div>

      <Component {...pageProps} />
    </div>
  )
}
