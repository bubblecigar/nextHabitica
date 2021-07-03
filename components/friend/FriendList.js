import { useFriend } from '../../lib/hooks'
import React from 'react'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { EyeIcon } from '@heroicons/react/outline'
import { mutate } from 'swr'
import { useUser } from '../../lib/hooks'
import DialogBox from '../../components/DialogBox'

const FriendRow = ({ friend, onGetData, setDataOpen }) => {
  const user = useUser()
  const friends = useFriend()
  const { requestor, acceptor, accepted } = friend
  const youAreRequestor = user.user_id === requestor
  const friendId = youAreRequestor ? acceptor : requestor

  const onAccept = async () => {
    const { requestor, acceptor } = friend
    const body = { requestor, acceptor, accepted: true }
    const _friends = friends.map(f => f.requestor === requestor && f.acceptor === acceptor ? { ...f, accepted: true } : f)
    mutate('/api/friend/read', _friends, false)
    const res = await window.fetch('/api/friend/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/friend/read')
  }

  const onRemove = async () => {
    const { requestor, acceptor, accepted } = friend
    const body = { requestor, acceptor }
    const _friends = friends.filter(f => !(f.requestor === requestor && f.acceptor === acceptor))
    mutate('/api/friend/read', _friends, false)
    const res = await window.fetch('/api/friend/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/friend/read')
  }

  const onInspect = type => async () => {
    setDataOpen(true)
    const body = { friendId }
    const res = await window.fetch(`/api/friend/data/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    onGetData({ type, data: await res.json() })
  }

  return (
    <tr>
      <td className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 text-center'>
          {friend.info.user_name}
        </div>
      </td>
      <td className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 text-center'>
          {accepted ? <EyeIcon onClick={onInspect('sleep')} className='cursor-pointer mx-auto h-5 w-5' aria-hidden='true' /> : null}
        </div>
      </td>
      <td className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 text-center'>
          {accepted ? <EyeIcon onClick={onInspect('eat')} className='cursor-pointer mx-auto h-5 w-5' aria-hidden='true' /> : null}
        </div>
      </td>
      <td className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 text-center'>
          {accepted ? <EyeIcon onClick={onInspect('exercise')} className='cursor-pointer mx-auto h-5 w-5' aria-hidden='true' /> : null}
        </div>
      </td>
      <td className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 text-center'>
          {
            accepted
              ? <button className='mx-2 text-red-400 hover:text-red-500 cursor-pointer' onClick={onRemove}>remove</button>
              : (
                youAreRequestor
                  ? 'pending...'
                  : <>
                    <button className='mx-2 text-indigo-600 hover:text-indigo-900 cursor-pointer' onClick={onAccept}>accept</button>
                    <button className='mx-2 text-red-400 hover:text-red-500 cursor-pointer' onClick={onRemove}>deny</button>
                  </>
              )
          }
        </div>
      </td>
    </tr>
  )
}

const FriendRequestDialog = ({ open, setOpen }) => {
  const [acceptorName, setAcceptorName] = React.useState('')
  const [resMessage, setResMessage] = React.useState('')
  const [isWaitForResponse, setIsWaitForResponse] = React.useState(false)

  const onSend = async () => {
    const body = { acceptorName }
    setIsWaitForResponse(true)
    const res = await window.fetch('/api/friend/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const resObject = await res.json()
    setIsWaitForResponse(false)
    if (resObject.done) { // onSuccess
      setAcceptorName('')
      setResMessage('')
      setOpen(false)
      mutate('/api/friend/read')
    } else {
      setResMessage(resObject.errorMessage)
    }
  }

  return <DialogBox open={open} setOpen={setOpen}>
    <table className='min-w-full divide-y divide-gray-200'>
      <tbody className='bg-white divide-y divide-gray-200'>
        <tr >
          <td className='flex items-center justify-between px-6 py-4 whitespace-nowrap text-sm font-medium'>
            <input value={acceptorName} onChange={e => {
              setAcceptorName(e.target.value)
              setResMessage('')
            }} placeholder='user name' className='py-1 px-2' />
            {isWaitForResponse ? 'wait for response...' : <div className='flex'>
              <button
                className='my-2 relative flex justify-center m-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none'
                onClick={onSend}
              >
                Send Request
              </button>
              <button
                className='my-2 relative flex justify-center m-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none'
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>}
          </td>
        </tr>
        {resMessage ? <tr>
          <td className='flex items-center justify-between px-6 py-4 whitespace-nowrap text-sm font-medium'>
            {resMessage}
          </td>
        </tr> : null}
      </tbody>
    </table>
  </DialogBox>
}

const FriendDataDialog = ({ open, setOpen, friendData }) => {
  if (!friendData) {
    return (
      <DialogBox open={open} setOpen={setOpen}>
        waiting for response...
      <button>OK</button>
      </DialogBox>
    )
  }
  switch (friendData.type) {
    case 'sleep': {
      return <DialogBox open={open} setOpen={setOpen}>
        {friendData.type}
        <button>OK</button>
      </DialogBox>
    }
    case 'eat': {
      return <DialogBox open={open} setOpen={setOpen}>
        {friendData.type}
        <button>OK</button>
      </DialogBox>
    }
    case 'exercise': {
      return <DialogBox open={open} setOpen={setOpen}>
        {friendData.type}
        <button>OK</button>
      </DialogBox>
    }
    default: {
      return <DialogBox open={open} setOpen={setOpen}>
        unhandled data type
        <button>OK</button>
      </DialogBox>
    }
  }
}

const FriendList = () => {
  const friends = useFriend()
  const [open, setOpen] = React.useState(false)
  const [dataOpen, setDataOpen] = React.useState(false)
  const [friendData, setFriendData] = React.useState(null)

  const onGetData = ({ type, data }) => {
    setFriendData({ type, data })
  }

  return (
    <div className='flex flex-col'>
      <div className=''>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div
            className='shadow border-gray-200 sm:rounded-lg overflow-y-auto max-h-75v'
          >
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Friend
                  </th>
                  <th
                    scope='col'
                    className='bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    sleep
                  </th>
                  <th
                    scope='col'
                    className='bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    eat
                  </th>
                  <th
                    scope='col'
                    className='bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    exercise
                  </th>
                  <th
                    scope='col'
                    className='bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    action
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {
                  friends.map(
                    (friend, i) => <FriendRow key={i} friend={friend} onGetData={onGetData} setDataOpen={setDataOpen} />
                  )
                }
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan='9' className='bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium hover:bg-gray-50 cursor-pointer hover:text-indigo-500 text-indigo-300' onClick={() => {
                      setOpen(true)
                    }}
                  >
                    <PlusCircleIcon className='mx-auto h-5 w-5' aria-hidden='true' />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <FriendRequestDialog open={open} setOpen={setOpen} />
          <FriendDataDialog open={dataOpen} setOpen={setDataOpen} friendData={friendData} />
        </div>
      </div>
    </div>
  )
}

export default FriendList