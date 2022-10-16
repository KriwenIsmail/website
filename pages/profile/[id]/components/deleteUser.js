import { signOut } from "next-auth/react"
import { Dialog, Transition } from '@headlessui/react'
import { useState, Fragment } from "react"
import TempLoading from "../../../../components/TempLoading"

const DeleteUser = ({ user, router, session }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempLoading, setTempLoading] = useState(false)

  const pushLog = async (log) => {
    await fetch(`/api/public/addToLog?log=${log}`)
  }

  const deleteAccount = async () => {
    setTempLoading(true)
    await fetch(`/api/moderateUser/deleteUserId?user_id=${user?.id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          if (session?.user?.id == user?.id) signOut()
          else router.push(`/profile/${user?.id}`)
          pushLog(`${user?.username} deleted their account`)
        }
        setIsOpen(false)
      })
    setTempLoading(false)
  }

  return (
    <>
      <TempLoading loading={tempLoading} />
      <button className="danger mt-4" onClick={() => setIsOpen(true)}>Delete account</button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-gray-900"
                  >
                    <i className="fas fa-triangle-exclamation"></i><span> Delete account?</span>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md text-gray-500">
                      Are you sure you want to delete your account?
                      <span className="block italic text-[11px] pt-1">(This is a temp delete meaning you can request having your account back)</span>
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      className="danger mr-2"
                      onClick={() => deleteAccount()}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      No
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default DeleteUser