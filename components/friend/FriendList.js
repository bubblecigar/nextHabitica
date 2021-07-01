import { useFriend } from '../../lib/hooks'
import React from 'react'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useUser } from '../../lib/hooks'
import DialogBox from '../../components/DialogBox'

const FriendRow = ({ friend }) => {
  console.log('friend:', friend)
  const user = useUser()
  const { requestor, acceptor, accepted } = friend
  const youAreRequestor = user.user_id === requestor
  const friendId = youAreRequestor ? acceptor : requestor
  return (
    <tr>
      <td className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 text-center'>
          {friendId}
        </div>
      </td>
      <td className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 text-center'>
          online status
        </div>
      </td>
      <td className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 text-center'>
          {
            accepted
              ? <button>remove</button>
              : (
                youAreRequestor
                  ? 'pending...'
                  : <>
                    <button>accept</button>
                    <button>deny</button>
                  </>
              )
          }
        </div>
      </td>
    </tr>
  )
}

const FriendList = () => {
  const friends = useFriend()

  const [open, setOpen] = React.useState(false)

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
                    status
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
                    (friend, i) => <FriendRow key={i} friend={friend} />
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
          <DialogBox open={open} setOpen={setOpen}>
            <table className='min-w-full divide-y divide-gray-200'>
              <tbody className='bg-white divide-y divide-gray-200'>
                <tr >
                  <td className='flex items-center justify-between px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <input placeholder='user name' className='py-1 px-2' />
                    <div className='flex'>
                      <button
                        className='my-2 relative flex justify-center m-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none'
                      >
                        Send Request
                    </button>
                      <button
                        className='my-2 relative flex justify-center m-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none'
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                    </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </DialogBox>
        </div>
      </div>
    </div>
  )
}

export default FriendList