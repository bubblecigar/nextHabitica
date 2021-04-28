import 'tailwindcss/tailwind.css'
import Link from 'next/link'

export default function App ({ Component, pageProps }) {
  return (
    <div>
      <Link href='/'>Account</Link>
      <Component {...pageProps} />
    </div>)
}
