import React, { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { mutate } from 'swr'
import { useSleep } from '../lib/hooks'
import intervalToDuration from 'date-fns/intervalToDuration'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import { format } from 'date-fns-tz'
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
                className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'
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

const SleepRow = (sl, setEditId) => {
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
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
          {sl.start && sl.end ? `${duration.hours}hr ${duration.minutes}min` : ''}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <a onClick={() => setEditId(sl.sleep_id)} className='text-indigo-600 hover:text-indigo-900 cursor-pointer'>
            Edit
        </a>
      </td>
    </tr>
  )
}

const SleepEditor = (sl, setEditId) => {
  return (
    <tr key={sl.sleep_id}>
      <td colSpan='5' className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <div className='mb-2'>睡眠起始</div>
        <DatePicker value={new Date()} onChange={() => {}} />
        <div className='mb-2 mt-3'>睡眠結束</div>
        <DatePicker value={new Date()} onChange={() => {}} />
        <div className='text-right mt-5'>
          <a onClick={() => (sl.sleep_id)} className='text-indigo-600 hover:text-indigo-900 cursor-pointer mr-4 font-bold'>Save</a>
          <a onClick={() => setEditId(null)} className='text-indigo-600 hover:text-indigo-900 cursor-pointer font-bold'>Cancel</a>
        </div>
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

  const [editId, setEditId] = React.useState(null)

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
                {sleep.map(sl => sl.sleep_id === editId
                  ? SleepEditor(sl, setEditId)
                  : SleepRow(sl, setEditId))}
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
