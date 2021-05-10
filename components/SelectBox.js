import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'

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

export default SelectBox
