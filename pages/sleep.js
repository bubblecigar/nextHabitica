import React, { Fragment, useState } from 'react'
import { Listbox, Transition, Dialog } from '@headlessui/react'
import { PlusCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useSleep } from '../lib/hooks'
import intervalToDuration from 'date-fns/intervalToDuration'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import { format } from 'date-fns-tz'
import isBefore from 'date-fns/isBefore'
import zhTWLocale from 'date-fns/locale/zh-TW'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const SelectBox = ({ value, onChange, label = '', options = [], className = '' }) => {
  return (
    <Listbox value={value} onChange={onChange} className={className}>
      {({ open }) => (
        <div>
          <div className='mt-1 relative'>
            <Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm p-1 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'>
              <span className='flex items-center ml-2 block truncate'>
                {value}
              </span>
              <span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                {label}
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options
                static
                className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-24 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
              >
                {options.map(option => (
                  <Listbox.Option
                    key={option}
                    className={({ active }) => classNames(
                      active ? 'text-white bg-indigo-600' : 'text-gray-900',
                      'cursor-default select-none relative p-1'
                    )}
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className='flex items-center'>
                          <span
                            className='ml-2 block truncate'
                          >
                            {option}
                          </span>
                        </div>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  )
}

const DatePicker = ({ value, onChange }) => {
  const [year, setYear] = useState(value.getFullYear())
  const yearOptions = React.useMemo(() => {
    const _year = value.getFullYear()
    const yearOptions = [_year - 2, _year - 1, _year, _year + 1, _year + 2]
    return yearOptions
  }, [value])
  const [month, setMonth] = useState(value.getMonth() + 1)
  const monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const [date, setDate] = useState(value.getDate())
  const dateOptions = React.useMemo(
    () => {
      const start = new Date(year, month - 1)
      const end = new Date(year, month)
      const datesWithin = eachDayOfInterval({ start, end })
      const dateOptions = datesWithin.slice(1).map((v, i) => i + 1)
      return dateOptions
    }, [year, month]
  )
  React.useEffect(
    () => {
      if (!dateOptions.includes(date)) {
        setDate(1)
      }
    }, [year, month]
  )

  const [hour, setHour] = useState(value.getHours())
  const hourOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  const [minute, setMinute] = useState(value.getMinutes())
  const minuteOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]

  React.useEffect(
    () => {
      onChange(new Date(year, month - 1, date, hour, minute))
    }, [year, month, date, hour, minute]
  )

  return (
    <div className='grid grid-cols-12 gap-4'>
      <div />
      <SelectBox
        label='年'
        className='col-span-3'
        value={year}
        onChange={setYear}
        options={yearOptions}
      />
      <SelectBox
        label='月'
        className='col-span-2'
        value={month}
        onChange={setMonth}
        options={monthOptions}
      />
      <SelectBox
        label='日'
        className='col-span-2'
        value={date}
        onChange={setDate}
        options={dateOptions}
      />
      <SelectBox
        label='時'
        className='col-span-2'
        value={hour}
        onChange={setHour}
        options={hourOptions}
      />
      <SelectBox
        label='分'
        className='col-span-2'
        value={minute}
        onChange={setMinute}
        options={minuteOptions}
      />
    </div>
  )
}

const SleepRow = ({ sl, setEditSl, hintId, setOpen }) => {
  const { years, months, days, hours, minutes } = intervalToDuration({ start: new Date(sl.start), end: new Date(sl.end) })
  const validDuration = years === 0 && months === 0 && days === 0
  const validOrder = isBefore(new Date(sl.start), new Date(sl.end))

  return (
    <tr
      key={sl.sleep_id}
      className={hintId === sl.sleep_id
        ? 'transition-colors duration-1000 bg-indigo-100'
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
        <a
          onClick={() => {
            setEditSl(sl)
            setOpen(true)
          }}
          className='text-indigo-600 hover:text-indigo-900 cursor-pointer'
        >
            Edit
        </a>
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

  const onCreate = async () => {
    setOpen(false)
    const body = { start, end }
    const res = await window.fetch('/api/sleep/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const { sleepId } = await res.json()
    await mutate('/api/sleep/read')
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
    await window.fetch('/api/sleep/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    await mutate('/api/sleep/read')
    setHintId(sl.sleep_id)
    setTimeout(() => {
      setHintId(null)
    }, 1000)
  }

  const onDelete = async () => {
    setOpen(false)
    const body = { sleepId: sl.sleep_id }
    await window.fetch('/api/sleep/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    await mutate('/api/sleep/read')
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

export default function Sleep (props) {
  const sleep = useSleep()

  const [editSl, setEditSl] = React.useState(null)
  const [hintId, setHintId] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const scrollRef = React.useRef(null)

  return (
    <div className='flex flex-col'>
      <div className=''>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div
            className='shadow border-b border-gray-200 sm:rounded-lg overflow-y-auto h-96'
            ref={scrollRef}
          >
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='sticky top-0'>
                <tr className='sticky top-0'>
                  <th
                    scope='col'
                    className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Date
                  </th>
                  <th
                    scope='col'
                    className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Start
                  </th>
                  <th
                    scope='col'
                    className='bg-gray-50 sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    End
                  </th>
                  <th
                    scope='col'
                    className='bg-gray-50 sticky top-0 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48'
                  >
                    Total
                  </th>
                  <th
                    scope='col'
                    className='bg-gray-50 sticky top-0 relative px-6 py-3'
                  >
                    <span className='sr-only'>Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {sleep.map(sl => (
                  <SleepRow
                    key={sl.sleep_id} sl={sl}
                    setEditSl={setEditSl}
                    hintId={hintId}
                    setOpen={setOpen}
                  />
                )
                )}
              </tbody>
            </table>
          </div>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as='div'
              static
              className='fixed z-10 inset-0 overflow-y-auto'
              open={open}
              onClose={setOpen}
            >
              <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>&#8203;</span>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  enterTo='opacity-100 translate-y-0 sm:scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                  leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                >
                  <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        <SleepEditor
                          sl={editSl}
                          setOpen={setOpen}
                          setHintId={setHintId}
                          scrollRef={scrollRef}
                        />
                      </tbody>
                    </table>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          <div
            colSpan='5' className='bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium hover:bg-gray-50 cursor-pointer hover:text-indigo-500 text-indigo-300' onClick={() => {
              setEditSl({})
              setOpen(true)
            }}
          >
            <PlusCircleIcon className='mx-auto h-5 w-5' aria-hidden='true' />
          </div>
        </div>
      </div>
    </div>
  )
}
