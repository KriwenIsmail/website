import { Transition, Dialog } from "@headlessui/react"
import { useState, Fragment } from "react"
import TempLoading from "../../../../components/TempLoading"

const Avatar = ({ user, router }) => {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [createObjectURL, setCreateObjectURL] = useState(null)

  const uploadToClient = e => {
    setLoading(true)
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
      setCreateObjectURL(URL.createObjectURL(e.target.files[0]))
    }
    setLoading(false)
  }

  const uploadToServer = async () => {
    setLoading(true)
    const body = new FormData()
    body.append('file', image)
    await fetch(`/api/upload/avatar?id=${user?.id}`, {
      method: 'POST',
      body
    })
    setIsOpen(false)
    setLoading(false)
  }

  return (
    <>
      <TempLoading loading={loading} />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <img alt="" className="" src={createObjectURL} />
                  <input type="file" accept="image/*" onChange={uploadToClient} />
                  <div className="text-sm mt-4 flex items-center justify-end">
                    <button className="primary" onClick={uploadToServer}>Confirm</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="inline-block ml-2">
        <button className="primary" onClick={() => setIsOpen(true)}><i className="fas fa-camera pr-1"></i> Update Avatar</button>
      </div>
    </>
  )
}

export default Avatar