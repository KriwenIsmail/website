import { getSession, useSession } from "next-auth/react"
import { Transition, Dialog } from "@headlessui/react"
import { useEffect, useState, Fragment } from "react"
import PageLoading from "../../components/PageLoading"
import HeadInfo from "../../components/Head"

const Messages = () => {
  const { data: session, status } = useSession()
  const user = session?.user
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const getMessages = async () => {
    /* await fetch(`/api/membersApi/messages/getAll?id=${user?.id}`)
      .then(res => res.json())
      .then(res => res?.data && setMessages(res?.data)) */
  }

  useEffect(() => {
    getMessages()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (status == 'loading') setLoading(true)
    if (status == 'authenticated') setLoading(false)
  }, [status])

  return (
    <>
      <HeadInfo title={'Messages'} />
      <PageLoading loading={loading} />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}

export default Messages