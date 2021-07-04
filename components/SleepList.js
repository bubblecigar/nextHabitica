import React from 'react'
import { PlusCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useSleep } from '../lib/hooks'
import intervalToDuration from 'date-fns/intervalToDuration'
import { format } from 'date-fns-tz'
import isBefore from 'date-fns/isBefore'
import zhTWLocale from 'date-fns/locale/zh-TW'
import DatePicker from './DatePicker'
import DialogBox from './DialogBox'

const SleepRow = ({ sl, editable }) => {
  const hintId = editable ? editable.hintId : null
  const { years, months, days, hours, minutes } = intervalToDuration({ start: new Date(sl.start), end: new Date(sl.end) })
  const validDuration = years === 0 && months === 0 && days === 0
  const validOrder = isBefore(new Date(sl.start), new Date(sl.end))

  return (
    <tr
      key={sl.sleep_id}
      className={hintId === sl.sleep_id
        ? 'transition-colors duration-1000 bg-indigo-50'
        : 'transition-colors duration-1000'}
    >
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
              ? format(new Date(sl.start), 'HH:mm', {
                locale: zhTWLocale
              })
              : '-'
          }
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>
          {sl.end ? format(new Date(sl.end), 'HH:mm') : '-'}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap  text-center'>
        {
          (validDuration && validOrder)
            ? (
              <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                {`${hours}hr ${minutes}min`}
              </span>
            )
            : (
              <span className='px-2 inline-flex text-red-400 text-xs'>
                <ExclamationCircleIcon className='mx-auto h-4 w-4 mr-1' aria-hidden='true' />
                {validOrder ? 'Over 24hr' : 'End before start'}
              </span>
            )

        }
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        {editable ? <a
          onClick={() => {
            editable.setEditSl(sl)
            editable.setOpen(true)
          }}
          className='text-xs text-indigo-600 hover:text-indigo-900 cursor-pointer'
        >
          Edit
        </a> : null}
      </td>
    </tr>
  )
}

const SleepEditor = ({ sl, setHintId, setOpen, scrollRef }) => {
  const [start, setStart] = React.useState(sl.start ? new Date(sl.start) : new Date())
  const [end, setEnd] = React.useState(sl.end ? new Date(sl.end) : new Date())

  const { years, months, days, hours, minutes } = intervalToDuration({ start: new Date(start), end: new Date(end) })
  const validDuration = years === 0 && months === 0 && days === 0
  const validOrder = isBefore(new Date(start), new Date(end))

  const sleep = useSleep()

  const onCreate = async () => {
    setOpen(false)
    const body = { start, end }
    mutate('/api/sleep/read', [null, ...sleep], false)
    const res = await window.fetch('/api/sleep/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const { sleepId } = await res.json()
    mutate('/api/sleep/read')
    setHintId(sleepId)
    setTimeout(() => {
      setHintId(null)
    }, 1000)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }

  const onUpdate = async () => {
    setOpen(false)
    const body = { start, end, sleepId: sl.sleep_id }
    mutate('/api/sleep/read', sleep.map(s => s.sleep_id === sl.sleep_id ? null : s), false)
    await window.fetch('/api/sleep/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/sleep/read')
    setHintId(sl.sleep_id)
    setTimeout(() => {
      setHintId(null)
    }, 1000)
  }

  const onDelete = async () => {
    setOpen(false)
    const body = { sleepId: sl.sleep_id }
    mutate('/api/sleep/read', sleep.filter(s => s.sleep_id !== sl.sleep_id), false)
    await window.fetch('/api/sleep/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    mutate('/api/sleep/read')
    setHintId(null)
  }

  return (
    <tr key={sl.sleep_id}>
      <td colSpan='5' className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <div className='mb-2'>睡眠起始</div>
        <DatePicker value={start} onChange={setStart} />
        <div className='mb-2 mt-3'>睡眠結束</div>
        <DatePicker value={end} onChange={setEnd} />
        <div className='mt-5 flex justify-end items-center pt-8'>
          <div className='mr-auto'>{
            validDuration && validOrder
              ? (
                <span className='px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                  {`${hours}hr ${minutes}min`}
                </span>
              )
              : (
                <span className='px-2 inline-flex text-red-400 text-sm'>
                  <ExclamationCircleIcon className='mx-auto h-5 w-5 mr-1' aria-hidden='true' />
                  {validOrder ? 'Over 24hr' : 'End before start'}
                </span>
              )
          }
          </div>
          <button
            className='my-2 relative flex justify-center m-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none'
            onClick={sl.sleep_id ? onUpdate : onCreate}
          >
            Save
          </button>
          {sl.sleep_id
            ? (
              <button
                className='my-2 relative flex justify-center my-1 py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-400 hover:bg-red-500 focus:outline-none'
                onClick={onDelete}
              >
                Delete
              </button>
            ) : null}
        </div>
      </td>
    </tr>
  )
}

const SleepHeadBody = ({ sleep, editable }) => {
  return (
    <>
      <thead>
        <tr>
          <th
            scope='col'
            className='bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
          >
            Date
          </th>
          <th
            scope='col'
            className='bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
          >
            Start
          </th>
          <th
            scope='col'
            className='bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
          >
            End
          </th>
          <th
            scope='col'
            className='bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48'
          >
            Duration
          </th>
          <th
            scope='col'
            className='bg-gray-50 px-6 py-3'
          >
            <span className='sr-only'>Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200'>
        {sleep.map((sl, i) => (
          sl
            ? (
              <SleepRow
                key={sl.sleep_id} sl={sl}
                editable={editable}
              />
            ) : (
              <tr key={i}>
                <td colSpan='5' className='bg-indigo-50 px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900 text-center'>
                    updating...
                  </div>
                </td>
              </tr>
            )
        )
        )}
      </tbody>
    </>
  )
}

export const SleepTable = ({ sleep }) => {
  return (
    <table className='min-w-full divide-y divide-gray-200'>
      <SleepHeadBody
        sleep={sleep}
        editable={false}
      />
    </table>
  )
}

const EditableSleepTable = ({ sleep, setEditSl, hintId, setOpen }) => {
  return (
    <table className='min-w-full divide-y divide-gray-200'>
      <SleepHeadBody
        sleep={sleep}
        editable={{ setEditSl, hintId, setOpen }}
      />
      <tfoot>
        <tr>
          <td
            colSpan='9' className='bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium hover:bg-gray-50 cursor-pointer hover:text-indigo-500 text-indigo-300' onClick={() => {
              setEditSl({})
              setOpen(true)
            }}
          >
            <PlusCircleIcon className='mx-auto h-5 w-5' aria-hidden='true' />
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

export default function SleepList(props) {
  const sleep = useSleep()

  const [editSl, setEditSl] = React.useState(null)
  const [hintId, setHintId] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const scrollRef = React.useRef(null)

  return (
    <div className='flex flex-col'>
      <div>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow border-gray-200 sm:rounded-lg overflow-y-auto max-h-75v'>
            <EditableSleepTable sleep={sleep} setEditSl={setEditSl} hintId={hintId} setOpen={setOpen} />
          </div>
          <DialogBox open={open} setOpen={setOpen}>
            <table style={{ width: '500px' }} className='min-w-full divide-y divide-gray-200'>
              <tbody className='bg-white divide-y divide-gray-200'>
                <SleepEditor
                  sl={editSl}
                  setOpen={setOpen}
                  setHintId={setHintId}
                  scrollRef={scrollRef}
                />
              </tbody>
            </table>
          </DialogBox>
        </div>
      </div>
    </div>
  )
}
