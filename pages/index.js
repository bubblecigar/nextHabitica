import Head from 'next/head'
import Link from 'next/link'

export default function Home (props) {
  console.log('props:', props)
  return (
    <div className='container'>
      <Head>
        <title>Create Next App ？？？</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Link href='users/12345'>link</Link>
        <h1 className='text-5xl'>bubble gogo</h1>
        <ul>
          <li>hp</li>
          <li>mp</li>
          <li>other attrs</li>
        </ul>
      </main>

    </div>
  )
}
