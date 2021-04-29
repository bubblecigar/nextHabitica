import 'tailwindcss/tailwind.css'
import Link from 'next/link'
import { useUser } from '../lib/hooks'

export default function App ({ Component, pageProps }) {
  const user = useUser({ redirectTo: '/' })
  return (
    <div>
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

      <Component {...pageProps} />
    </div>)
}
