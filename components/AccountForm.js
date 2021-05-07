import { useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/solid'

export const login = async body => {
  try {
    const res = await fetch('api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (res.status === 200) {
      location.reload()
    } else {
      throw new Error(await res.text())
    }
  } catch (error) {
    console.log('login error:', error)
    return error.message
  }
}

export const signup = async body => {
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
    console.error('signup error:', error)
    return 'Sign up error, username might be used'
  }
}

export default function AccountForm (props) {
  const [errorMsg, setErrorMsg] = useState('')
  const [submitType, setSubmitType] = useState('login')

  const handleSubmit = async e => {
    e.preventDefault()
    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value
    }
    if (submitType === 'login') {
      const errMsg = await login(body)
      setErrorMsg(errMsg)
    } else if (submitType === 'signup') {
      const errMsg = await signup(body)
      console.log('errMsg:', errMsg)
      setErrorMsg(errMsg)
    }
  }

  return (
    <div className='max-w-md w-full space-y-8 my-auto'>
      <div>
        <img
          className='mx-auto h-12 w-auto'
          src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
          alt='Workflow'
        />
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Who are you?</h2>
      </div>
      <form id='account-form' className='mt-8 space-y-6' onSubmit={handleSubmit}>
        <input type='hidden' name='remember' defaultValue='true' />
        <div className='rounded-md shadow-sm -space-y-px'>
          <div>
            <label htmlFor='username' className='sr-only'>
              User name
            </label>
            <input
              id='username'
              name='username'
              type='text'
              autoComplete='text'
              required
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='User name'
            />
          </div>
          <div>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Password'
            />
          </div>
        </div>

        {/* <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div> */}
        <div>
          <button
            type='submit'
            form='account-form'
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            onClick={() => setSubmitType('login')}
          >
            <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
              <LockClosedIcon className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400' aria-hidden='true' />
            </span>
            Log in
          </button>
          <button
            type='submit'
            form='account-form'
            className='my-2 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            onClick={() => setSubmitType('signup')}
          >
            Sign up
          </button>
        </div>
        <div>&nbsp;{errorMsg}</div>
      </form>
    </div>
  )
}
