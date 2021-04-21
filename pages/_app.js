import 'tailwindcss/tailwind.css'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import Link from 'next/link'

export default function App ({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Link href='/'>index</Link>
      <Link href='/user'>user</Link>
      <Link href='/tasks'>tasks</Link>
      <Link href='/shop'>shop</Link>
      <Link href='/part'>party</Link>
      <Component {...pageProps} />
    </Provider>)
}
