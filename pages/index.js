import Head from 'next/head'
import UserPanel from '../features/user/UserPanel'
import store from '../app/store'
import { Provider } from 'react-redux'

export default function Home (props) {
  return (
    <div className='container'>
      <Head>
        <title>Create Next App ？？？</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1 className='text-5xl'>bubble gogo</h1>
        <UserPanel />
      </main>

    </div>
  )
}
