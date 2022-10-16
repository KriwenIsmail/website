import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Notifications from './Notifications'

const classNames = (...classes) => classes.filter(Boolean).join(' ')
const Navbar = ({ theme, setTheme }) => {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <Disclosure as="nav" className="shadow-md shadow-neutral-500/[0.45] bg-gray-900 navbar-fix">
      {({ open }) => (
        <>
          <div className="container">
            <div className={`relative flex items-center justify-between h-14`}>
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex">
                    <Link href='/'>
                      <Disclosure.Button
                        className={classNames(
                          router.pathname == '/' ? 'text-white' : 'text-gray-400 hover:text-white',
                          'block px-[10px] pl-0 cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                        )}>home</Disclosure.Button>
                    </Link>
                    {session?.user && <><Link href='/profile/[id]' as={`/profile/${session?.user?.id}`}>
                      <Disclosure.Button
                        className={classNames(
                          router.pathname == '/profile[id]' ? 'text-white' : 'text-gray-400 hover:text-white',
                          'block px-[10px] cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                        )}>profile</Disclosure.Button>
                    </Link>
                      <Link href='/messages'>
                        <Disclosure.Button
                          className={classNames(
                            router.pathname == '/messages' ? 'text-white' : 'text-gray-400 hover:text-white',
                            'block px-[10px] last:pr-0 cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                          )}>messages</Disclosure.Button>
                      </Link>
                      <Link href='/members'>
                        <Disclosure.Button
                          className={classNames(
                            router.pathname == '/members' ? 'text-white' : 'text-gray-400 hover:text-white',
                            'block px-[10px] last:pr-0 cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                          )}>members</Disclosure.Button>
                      </Link></>}
                    {!session?.user && <Link href='/login'>
                      <Disclosure.Button
                        className={classNames(
                          router.pathname == '/login' ? 'text-white' : 'text-gray-400 hover:text-white',
                          'block px-[10px] last:pr-0 cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                        )}>login</Disclosure.Button>
                    </Link>}
                    {session?.user?.rank?.access_dashboard && <Link href='/admin'>
                      <Disclosure.Button
                        className={classNames(
                          router.pathname == '/admin' ? 'text-white' : 'text-gray-400 hover:text-white',
                          'block px-[10px] last:pr-0 cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                        )}>admin</Disclosure.Button>
                    </Link>}
                  </div>
                </div>
              </div>
              {session && session?.user && <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Notifications />
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full p-0">
                      <span className="sr-only">Open user menu</span>
                      <div className="w-8 h-8">
                        <Image width='100%' height='100%' className="rounded-full" layout='responsive' src={`/assets/avatars/${session?.user?.avatar}`} loading='lazy' objectFit='cover' />
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="origin-top-right absolute right-0 mt-1 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-black ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        <span className={'cursor-default block px-4 py-2 text-sm text-gray-700 dark:text-white dark:bg-black'}>
                          Welcome {session?.user?.username}
                        </span>
                      </Menu.Item>
                      <Menu.Item>
                        <a href={`/profile/${session?.user?.id}`} className={'hover:bg-gray-100 dark:hover:bg-gray-800 block px-4 py-2 text-sm text-gray-700 dark:text-white'}>
                          Profile
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a href={`/profile/${session?.user?.id}/settings`} className={'hover:bg-gray-100 dark:hover:bg-gray-800 block px-4 py-2 text-sm text-gray-700 dark:text-white'}>
                          Settings
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <div className="cursor-default flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 text-sm text-gray-700 dark:text-white">
                          <span>Dark Mode</span>
                          <div onClick={() => setTheme(theme == 'dark' ? 'light' : 'dark')} className={`${theme == 'dark' ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[15px] w-[45px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                            <span className="sr-only">Use setting</span>
                            <span aria-hidden="true" className={`${theme == 'dark' ? 'left-[80%]' : 'left-[15%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                          </div>
                        </div>
                      </Menu.Item>
                      <div className="h-[1px] my-1 bg-gray-500 w-full"></div>
                      <Menu.Item>
                        <span className={'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white'} onClick={() => signOut()}>
                          Sign out
                        </span>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>}
            </div>
          </div>

          <Disclosure.Panel className={`sm:hidden ${open && 'border-t-2 border-gray-400'}`}>
            <div className={`px-2 pt-2 pb-3 space-y-1`}>
              <Link href='/'>
                <Disclosure.Button className={classNames(
                  router.pathname == '/' ? 'text-white bg-gray-700' : 'text-gray-400',
                  'block px-[10px] py-[5px] cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                )} area-current={router.pathname == '/' ? 'page' : undefined}>
                  home
                </Disclosure.Button>
              </Link>
              {session?.user && <><Link href='/profile/[id]' as={`/profile/${session?.user?.id}`}>
                <Disclosure.Button className={classNames(
                  router.pathname == '/profile/[id]' ? 'text-white bg-gray-700' : 'text-gray-400',
                  'block px-[10px] py-[5px] cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                )} area-current={router.pathname == '/profile/[id]' ? 'page' : undefined}>
                  profile
                </Disclosure.Button>
              </Link>
                <Link href='/messages'>
                  <Disclosure.Button className={classNames(
                    router.pathname == '/messages' ? 'text-white bg-gray-700' : 'text-gray-400',
                    'block px-[10px] py-[5px] cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                  )} area-current={router.pathname == '/messages' ? 'page' : undefined}>
                    messages
                  </Disclosure.Button>
                </Link>
                <Link href='/members'>
                  <Disclosure.Button className={classNames(
                    router.pathname == '/members' ? 'text-white bg-gray-700' : 'text-gray-400',
                    'block px-[10px] py-[5px] cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                  )} area-current={router.pathname == '/members' ? 'page' : undefined}>
                    members
                  </Disclosure.Button>
                </Link></>}
              {!session?.user && <Link href='/login'>
                <Disclosure.Button className={classNames(
                  router.pathname == '/login' ? 'text-white bg-gray-700' : 'text-gray-400',
                  'block px-[10px] py-[5px] cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                )} area-current={router.pathname == '/login' ? 'page' : undefined}>
                  login
                </Disclosure.Button>
              </Link>}
              {session?.user?.rank?.access_dashboard && <Link href='/admin'>
                <Disclosure.Button className={classNames(
                  router.pathname == '/admin' ? 'text-white bg-gray-700' : 'text-gray-400',
                  'block px-[10px] py-[5px] cursor-pointer rounded-sm text-base font-medium transition duration-150 ease-out hover:ease-in'
                )} area-current={router.pathname == '/' ? 'page' : undefined}>
                  admin
                </Disclosure.Button>
              </Link>}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar