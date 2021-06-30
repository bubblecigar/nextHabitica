import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import '../styles/global.css'
import NavigationBar from '../components/NavigationBar'
import { useUser } from '../lib/hooks'
import Image from 'next/image'

export default function App({ Component, pageProps }) {
  const user = useUser({ redirectTo: '/' })

  return (
    <div className='min-h-screen flex items-start justify-center bg-gray-50 py-28 px-4 sm:px-6 lg:px-8'>
      <Head>
        <title>Next Habitica</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/star.png"></link>
      </Head>
      {user ? <NavigationBar /> : null}
      <Component {...pageProps} />
    </div>
  )
}
