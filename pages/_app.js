import 'tailwindcss/tailwind.css'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import Link from 'next/link'

export default function App ({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Link href='/'>Account</Link>
      <Component {...pageProps} />
    </Provider>)
}
