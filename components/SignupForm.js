import { useState } from 'react'
import { login } from './LoginForm'

const SignupForm = () => {
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit (e) {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value
    }

    if (body.password !== e.currentTarget.password.value) {
      setErrorMsg('The passwords don\'t match')
      return
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.status === 200) {
        await login(body)
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>user name</label>
        <input type='text' id='username' name='username' required />
        <label htmlFor='password'>password</label>
        <input type='text' id='password' name='password' required />
        <button type='submit'>sign up</button>
      </form>
      {errorMsg ? <span>{errorMsg}</span> : null}
    </div>
  )
}

export default SignupForm
