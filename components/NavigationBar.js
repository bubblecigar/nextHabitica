import { Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { useUser } from '../lib/hooks'

const navigation = ['Sleep', 'Eat', 'Exercise']

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const unSelectedPage = 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
const selectedPage = 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'

const NavigationBar = () => {
  const user = useUser()
  const router = useRouter()

  return (
    <div className='fixed left-0 top-0 w-screen'>
      <Disclosure as='nav' className='bg-gray-800'>
        {({ open }) => (
          <>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex items-center justify-between h-16'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <Link href='/'>
                      <img
                        className='h-8 w-8 cursor-pointer'
                        src='https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg'
                        alt='Workflow'
                      />
                    </Link>
                  </div>
                  <div>
                    <div className='ml-10 flex items-baseline space-x-4'>
                      {navigation.map((item, itemIdx) =>
                        (
                          <Fragment key={item}>
                            <Link href={`/${item.toLowerCase()}`}>
                              <a className={router.route.includes(item.toLowerCase()) ? selectedPage : unSelectedPage}>
                                {item}
                              </a>
                            </Link>
                          </Fragment>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className='ml-4 flex items-center md:ml-6'>
                    <Menu as='div' className='ml-3 relative'>
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className='max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                              <span className='sr-only'>Open user menu</span>
                              <img
                                className='h-8 w-8 rounded-full'
                                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                alt=''
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter='transition ease-out duration-100'
                            enterFrom='transform opacity-0 scale-95'
                            enterTo='transform opacity-100 scale-100'
                            leave='transition ease-in duration-75'
                            leaveFrom='transform opacity-100 scale-100'
                            leaveTo='transform opacity-0 scale-95'
                          >
                            <Menu.Items
                              static
                              className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                            >
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href='/api/logout'
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    Log out
                                  </a>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>

  )
}

export default NavigationBar
