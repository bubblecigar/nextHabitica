import Head from 'next/head'
import UserPanel from '../features/user/UserPanel'
import Axios from 'axios'

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
        <button onClick={() => {
          Axios.post('/api/test').then(
            res => {
              console.log('res:', res)
            }
          )
        }}
        >test
        </button>
      </main>

    </div>
  )
}
