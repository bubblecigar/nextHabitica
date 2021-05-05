import React from 'react'
import { mutate } from 'swr'
import { useSleep } from '../lib/hooks'
import intervalToDuration from 'date-fns/intervalToDuration'
import { format } from 'date-fns-tz'
import zhTWLocale from 'date-fns/locale/zh-TW'
import { PlusCircleIcon } from '@heroicons/react/solid'

const SleepEditor = (sl) => {
  const duration = intervalToDuration({ start: new Date(sl.start), end: new Date(sl.end) })

  return (
    <tr key={sl.sleep_id}>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>
          {
            sl.start
              ? format(new Date(sl.start), 'MMMdo cccc', {
                locale: zhTWLocale
              })
              : '-'
          }
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>
          {
            sl.start
              ? format(new Date(sl.start), 'HH:mm:ss', {
                locale: zhTWLocale
              })
              : '-'
          }
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>
          {sl.end ? format(new Date(sl.end), 'HH:mm:ss') : '-'}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
          {sl.start && sl.end ? `${duration.hours}hr ${duration.minutes}min` : ''}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <a href='#' className='text-indigo-600 hover:text-indigo-900'>
            Edit
        </a>
      </td>
    </tr>
  )
}

export default function Sleep (props) {
  const sleep = useSleep()

  const onCreate = async () => {
    await window.fetch('/api/sleep/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    mutate('/api/sleep/read')
  }

  return (
    <div className='flex flex-col'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Date
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Start
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    End
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Total
                  </th>
                  <th scope='col' className='relative px-6 py-3'>
                    <span className='sr-only'>Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {sleep.map(sl => SleepEditor(sl))}
                <tr>
                  <td colSpan='5' className='px-6 py-4 whitespace-nowrap text-sm font-medium hover:bg-gray-50 cursor-pointer hover:text-indigo-500  text-indigo-300' onClick={onCreate}>
                    <PlusCircleIcon className='mx-auto h-5 w-5' aria-hidden='true' />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
