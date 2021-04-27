import Router from 'next/router'

export default function Login (props) {
  const handleSubmit = async e => {
    e.preventDefault()

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value
    }

    try {
      const res = await fetch('api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.status === 200) {
        Router.push('/')
      } else {
        throw new Error(await res.text())
      }
    } catch (err) {
      console.log('err:', err)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>user name</label>
        <input type='text' id='username' name='username' required />
        <label htmlFor='password'>password</label>
        <input type='text' id='password' name='password' required />
        <button type='submit'>log in</button>
      </form>
    </div>
  )
}
