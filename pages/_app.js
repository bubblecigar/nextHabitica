import 'tailwindcss/tailwind.css'
import Link from 'next/link'
import { useUser } from '../lib/hooks'

export default function App ({ Component, pageProps }) {
  const user = useUser({ redirectTo: '/' })
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      {/* <Link href='/' className='absolute'>Account</Link> */}
      {/*
        user
          ? (
            <>
              <Link href='/sleep'>sleep</Link>
              <Link href='/eat'>eat</Link>
              <Link href='/exercise'>exercise</Link>
            </>
          )
          : null
      */}

      <Component {...pageProps} />
    </div>
  )
}
