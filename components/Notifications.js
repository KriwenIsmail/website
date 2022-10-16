import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect, Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { BellIcon } from '@heroicons/react/outline'
import TempLoading from "./TempLoading"
import formatDate from "../utils/formatDate"
import pushLog from "../utils/pushLog"

const Notifications = () => {
  const { data: session } = useSession()
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [memberApproval, setMemberApproval] = useState(false)
  const [loading, setLoading] = useState(false)
  const getNotifications = async () => {
    await fetch(`/api/membersApi/getNotifications?user_id=${session?.user?.id}`)
      .then(res => res.json())
      .then(data => setNotifications(data?.data.reverse()))
  }

  const checkMemberApproval = async () => {
    await fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => setMemberApproval(data?.data?.memberVerification))
  }

  const deleteNotification = async (id) => {
    await fetch(`/api/public/deleteNotification?id=${id}`)
      .then(res => res.json())
      .then(() => getNotifications())
  }

  const verifyUser = async (user, id) => {
    setLoading(true)
    await fetch(`/api/moderateUser/verifyUserByName?name=${user}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          deleteNotification(id)
          pushLog(`${session?.user?.name} has verified ${user}`)
        }
      })
    setLoading(false)
  }

  const deleteUser = async (user, id) => {
    setLoading(true)
    await fetch(`/api/moderateUser/permDeleteByName?user_name=${user}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          deleteNotification(id)
          pushLog(`${session?.user?.name} has deleted ${user}`)
        }
      })
    setLoading(false)
  }

  const markAsRead = async () => {
    await fetch(`/api/public/markAllAsRead`)
    getNotifications()
  }

  const checkCount = async () => {
    await fetch('/api/public/countNotifications')
      .then(res => res.json())
      .then(data => data?.data && setCount(data?.data))
  }

  useEffect(() => {
    setLoading(true)
    getNotifications()
    checkMemberApproval()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (notifications.length == 0) return
    checkCount()
  }, [notifications])

  return (
    <>
      <TempLoading loading={loading} />
      <Menu as="div" className="ml-3 relative">
        {count > 0 && <div className="absolute -top-1 -right-2 rounded-full bg-red-500 text-center text-white p-1 w-[20px] h-[20px] text-sm flex items-center justify-center">{count}</div>}
        <Menu.Button
          type="button"
          onClick={markAsRead}
          className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="w-[250px] lg:w-[400px] overflow-y-auto max-h-[400px] origin-top-right absolute right-0 mt-1 rounded-md shadow-lg py-1 bg-white dark:bg-black">
            {notifications.length > 0 && notifications.map(_ => <Menu.Item key={_?.id}>
              <span className={`block ${notifications.length > 1 && 'first:border-t-0 border-t-2 border-t-gray-300'} px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray`} key={_?.id}>
                {(_?.type == 'quote' || _?.type == 'like') && (
                  <Link href='/posts/[id]' as={`${_?.refersTo}`}>
                    <span className="block text-lg cursor-pointer hover:underline">{_?.content}</span>
                  </Link>
                ) || <span className="block text-lg">{_?.content}</span>}
                {_?.type == 'member approval' && <>
                  {!memberApproval && <div className="text-sm italic">(does not affect target's login)</div>}
                  <button onClick={() => verifyUser(_?.content.split(' ')[0], _?.id)} className="primary mt-2 mr-2 text-sm">Verify</button>
                  {session?.user?.rank?.delete_users && <button onClick={() => deleteUser(_?.content.split(' ')[0], _?.id)} className="danger mt-2 text-sm">Delete</button>}
                </>}
                <div className="block text-right font-light">
                  <span>{`${formatDate(_?.notifiedAt).MONTH} ${formatDate(_?.notifiedAt).DAY}, ${formatDate(_?.notifiedAt).YEAR} at ${formatDate(_?.notifiedAt).HOURS}:${formatDate(_?.notifiedAt).MINUTES}`}</span>
                </div>
              </span>
            </Menu.Item>) || <Menu.Item>
                <div className="block px-4 py-2 text-sm text-gray-700 dark:text-white">No notifications.</div>
              </Menu.Item>}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default Notifications