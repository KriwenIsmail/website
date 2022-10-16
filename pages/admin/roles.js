import { useSession } from "next-auth/react"
import { Dialog, Transition } from '@headlessui/react'
import { useState, useEffect, Fragment } from "react"
import TempLoading from "../../components/TempLoading"
import pushLog from "../../utils/pushLog"

const orderData = (list, orderBy) => {
  const arr = []
  list.map(_ => arr[_[orderBy] - 1] = _)
  return arr
}

const Role = ({ data, reload, ranksLength, setLoading }) => {
  const { data: session } = useSession()
  const [name, setName] = useState(data?.name)
  const [color, setColor] = useState(data?.color)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = useState(false)
  const [admin, setAdmin] = useState(data?.admin)
  const [deletePosts, setDeletePosts] = useState(data?.delete_posts)
  const [deleteUsers, setDeleteUsers] = useState(data?.delete_users)
  const [hidePosts, setHidePosts] = useState(data?.hide_posts)
  const [lockPosts, setLockPosts] = useState(data?.lock_posts)
  const [lockTopics, setLockTopics] = useState(data?.lock_topics)
  const [deleteTopics, setDeleteTopics] = useState(false)
  const [hideTopics, setHideTopics] = useState(false)
  const [manageCategories, setManageCategories] = useState(data?.manage_categories)
  const [manageRoles, setManageRoles] = useState(data?.manage_roles)
  const [verifyUsers, setVerifyUsers] = useState(data?.verify_users)
  const [accessDashboard, setAccessDashboard] = useState(data?.access_dashboard)
  const [manageSettings, setManageSettings] = useState(data?.manage_settings)
  const [restoreUsers, setRestoreUsers] = useState(data?.restore_users)
  const [banUsers, setBanUsers] = useState(data?.ban_users)
  const updateRole = async () => {
    setLoading(true)
    if (name != '' && name != data?.name) {
      await fetch(`/api/ranks/updateName?id=${data?.id}&name=${name}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} updated ${data?.name}'s name to ${name}`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (color != '' && color != data?.color && color.includes('#')) {
      await fetch(`/api/ranks/updateColor?id=${data?.id}&color=${color?.split('#')[1]}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} updated ${data?.name}'s color to ${color}`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (admin != data?.admin) {
      await fetch(`/api/ranks/updateAdmin?id=${data?.id}&value=${admin}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${admin ? 'enabled' : 'disabled'} ${data?.name}'s admin`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (deletePosts != data?.deletePosts) {
      await fetch(`/api/ranks/updateDeletePosts?id=${data?.id}&value=${deletePosts}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${deletePosts ? 'enabled' : 'disabled'} ${data?.name}'s to delete posts`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (deleteUsers != data?.deleteUsers) {
      await fetch(`/api/ranks/updateDeleteUsers?id=${data?.id}&value=${deleteUsers}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${deleteUsers ? 'enabled' : 'disabled'} ${data?.name}'s to delete users`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (hidePosts != data?.hidePosts) {
      await fetch(`/api/ranks/updateHidePosts?id=${data?.id}&value=${hidePosts}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${hidePosts ? 'enabled' : 'disabled'} ${data?.name}'s to hide posts`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (lockPosts != data?.lockPosts) {
      await fetch(`/api/ranks/updateLockPosts?id=${data?.id}&value=${lockPosts}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${lockPosts ? 'enabled' : 'disabled'} ${data?.name}'s to lock posts`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (lockTopics != data?.lockTopics) {
      await fetch(`/api/ranks/updateLockTopics?id=${data?.id}&value=${lockTopics}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${lockTopics ? 'enabled' : 'disabled'} ${data?.name}'s to lock posts`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (deleteTopics != data?.lockTopics) {
      await fetch(`/api/ranks/updateDeleteTopics?id=${data?.id}&value=${deleteTopics}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${deleteTopics ? 'enabled' : 'disabled'} ${data?.name}'s to delete posts`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (hideTopics != data?.lockTopics) {
      await fetch(`/api/ranks/updateHideTopics?id=${data?.id}&value=${hideTopics}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${hideTopics ? 'enabled' : 'disabled'} ${data?.name}'s to hide topics`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (manageCategories != data?.manageCategories) {
      await fetch(`/api/ranks/updateManageCategories?id=${data?.id}&value=${manageCategories}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${manageCategories ? 'enabled' : 'disabled'} ${data?.name}'s to manage categories`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (manageRoles != data?.manageRoles) {
      await fetch(`/api/ranks/updateManageRoles?id=${data?.id}&value=${manageRoles}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${manageRoles ? 'enabled' : 'disabled'} ${data?.name}'s to manage roles`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (verifyUsers != data?.verifyUsers) {
      await fetch(`/api/ranks/updateVerifyUsers?id=${data?.id}&value=${verifyUsers}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${verifyUsers ? 'enabled' : 'disabled'} ${data?.name}'s to verify users`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (accessDashboard != data?.accessDashboard) {
      await fetch(`/api/ranks/updateAccessDashboard?id=${data?.id}&value=${accessDashboard}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${accessDashboard ? 'enabled' : 'disabled'} ${data?.name}'s to access dashboard`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (manageSettings != data?.manageSettings) {
      await fetch(`/api/ranks/updateManageSettings?id=${data?.id}&value=${manageSettings}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${manageSettings ? 'enabled' : 'disabled'} ${data?.name}'s to manage settings`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (restoreUsers != data?.restoreUsers) {
      await fetch(`/api/ranks/updateRestoreUsers?id=${data?.id}&value=${restoreUsers}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${restoreUsers ? 'enabled' : 'disabled'} ${data?.name}'s to restore users`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    if (banUsers != data?.banUsers) {
      await fetch(`/api/ranks/updateBanUsers?id=${data?.id}&value=${banUsers}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            pushLog(`${session?.user?.username} ${banUsers ? 'enabled' : 'disabled'} ${data?.name}'s to ban/unban users`)
            setTimeout(() => reload(true), 0)
          }
        })
    }
    setLoading(false)
  }

  const deleteRank = async () => {
    setLoading(true)
    await fetch(`/api/ranks/delete?id=${data?.id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          pushLog(`${session?.user?.username} deleted a rank`)
          setTimeout(() => reload(true), 0)
        }
      })
    setLoading(false)
  }

  const moveUp = async () => {
    setLoading(true)
    await fetch(`/api/ranks/moveUp?id=${data?.id}&index=${data?.order}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          pushLog(`${session?.user?.username} moved ${data?.name} up`)
          setTimeout(() => reload(true), 0)
        }
      })
    setLoading(false)
  }

  const moveDown = async () => {
    setLoading(true)
    await fetch(`/api/ranks/moveDown?id=${data?.id}&index=${data?.order}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          pushLog(`${session?.user?.username} moved ${data?.name} down`)
          setTimeout(() => reload(true), 0)
        }
      })
    setLoading(false)
  }

  return (
    <>
      <input type="text" value={name} onChange={e => setName(e.target.value)} className="col-span-2 bg-gray-200 rounded py-1 px-2 border-2 focus:border-purple-500 dark:text-black dark:focus:text-white focus:bg-transparent font-medium" />
      <input type="text" value={color} onChange={e => setColor(e.target.value)} className="col-span-2 bg-gray-200 rounded py-1 px-2 border-2 focus:border-purple-500 dark:text-black dark:focus:text-white focus:bg-transparent font-medium" />
      <button className="btn-secondary col-span-1" onClick={() => setIsOpen(true)}>More</button>
      <button className="danger col-span-1" onClick={() => setDeleteConfirmationIsOpen(true)}>Delete</button>
      <button className="success col-span-1" onClick={() => updateRole()}>Save</button>
      <Transition appear show={deleteConfirmationIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-12" onClose={() => setDeleteConfirmationIsOpen(false)}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title>
                    <div className="text-2xl">
                      <i className="fas fa-triangle-exclamation"></i>
                      <span className="pl-2"> Delete rank?</span>
                    </div>
                  </Dialog.Title>
                  <Dialog.Description className="py-2">
                    Are you sure you want to delete this rank?
                  </Dialog.Description>
                  <div>
                    <button className="danger" onClick={() => deleteRank()}>Yes</button>
                    <button className="btn-secondary ml-2" onClick={() => setDeleteConfirmationIsOpen(false)}>Cancel</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                <Dialog.Panel className="w-full max-w-md max-h-96 transform overflow-x-hidden overflow-y-auto rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <span>Admin rank</span>
                    <div onClick={() => setAdmin(prev => !prev)} className={`${admin ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${admin ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Delete posts</span>
                    <div onClick={() => setDeletePosts(prev => !prev)} className={`${deletePosts ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${deletePosts ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Delete users</span>
                    <div onClick={() => setDeleteUsers(prev => !prev)} className={`${deleteUsers ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${deleteUsers ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Hide posts</span>
                    <div onClick={() => setHidePosts(prev => !prev)} className={`${hidePosts ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${hidePosts ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Lock posts</span>
                    <div onClick={() => setLockPosts(prev => !prev)} className={`${lockPosts ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${lockPosts ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Delete topics</span>
                    <div onClick={() => setDeleteTopics(prev => !prev)} className={`${deleteTopics ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${deleteTopics ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Hide topics</span>
                    <div onClick={() => setHideTopics(prev => !prev)} className={`${hideTopics ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${hideTopics ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Lock topics</span>
                    <div onClick={() => setLockTopics(prev => !prev)} className={`${lockTopics ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${lockTopics ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Manage categories</span>
                    <div onClick={() => setManageCategories(prev => !prev)} className={`${manageCategories ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${manageCategories ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Manage roles</span>
                    <div onClick={() => setManageRoles(prev => !prev)} className={`${manageRoles ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${manageRoles ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Verify users</span>
                    <div onClick={() => setVerifyUsers(prev => !prev)} className={`${verifyUsers ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${verifyUsers ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Access dashboard</span>
                    <div onClick={() => setAccessDashboard(prev => !prev)} className={`${accessDashboard ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${accessDashboard ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Mmanage settings</span>
                    <div onClick={() => setManageSettings(prev => !prev)} className={`${manageSettings ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${manageSettings ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Restore users</span>
                    <div onClick={() => setRestoreUsers(prev => !prev)} className={`${restoreUsers ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${restoreUsers ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Ban users</span>
                    <div onClick={() => setBanUsers(prev => !prev)} className={`${banUsers ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${banUsers ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-start mt-4 text-sm">
                    <button className="dark mr-2" onClick={moveUp} disabled={data?.order == 1}><i className="fas fa-caret-up"></i></button>
                    <button className="dark" onClick={moveDown} disabled={data?.order == ranksLength}><i className="fas fa-caret-down"></i></button>
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

const Roles = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [ranks, setRanks] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [realod, setReload] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#000000')
  const [admin, setAdmin] = useState(false)
  const [deletePosts, setDeletePosts] = useState(false)
  const [deleteUsers, setDeleteUsers] = useState(false)
  const [hidePosts, setHidePosts] = useState(false)
  const [lockPosts, setLockPosts] = useState(false)
  const [deleteTopics, setDeleteTopics] = useState(false)
  const [hideTopics, setHideTopics] = useState(false)
  const [lockTopics, setLockTopics] = useState(false)
  const [manageCategories, setManageCategories] = useState(false)
  const [manageRoles, setManageRoles] = useState(false)
  const [verifyUsers, setVerifyUsers] = useState(false)
  const [accessDashboard, setAccessDashboard] = useState(false)
  const [manageSettings, setManageSettings] = useState(false)
  const [restoreUsers, setRestoreUsers] = useState(false)
  const [banUsers, setBanUsers] = useState(false)
  const getRanks = async () => {
    await fetch('/api/membersApi/getRanks')
      .then(res => res.json())
      .then(data => data?.data && setRanks(orderData(data?.data, 'order')))
  }

  const createRank = async () => {
    if (name == '' || color == '' || !color.includes('#') || color.length < 7 || color.length > 7) return
    setLoading(true)
    const json_data = { name, color: color.split('#')[1], admin, deletePosts, deleteUsers, hidePosts, lockPosts, lockTopics, manageCategories, manageRoles, verifyUsers, accessDashboard, manageSettings, restoreUsers, banUsers, deleteTopics, hideTopics }
    await fetch(`/api/ranks/create?data=${JSON.stringify(json_data)}`)
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          pushLog(`${session?.user?.username} created a new rank with ID: ${data?.data?.id} & name: ${name}`)
          setTimeout(() => setReload(true), 0)
        }
      })
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getRanks()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (realod == false) return
    getRanks()
    setReload(false)
  }, [realod])

  return (
    <>
      <TempLoading loading={loading} />
      <div className="w-4/5 mx-auto grid grid-cols-7 gap-5 mb-2 last:mb-0">
        {ranks.map(_ => <Role key={_?.id} data={_} reload={setReload} ranksLength={ranks.length} setLoading={setLoading} />)}
        <div className="flex col-span-full items-center justify-end">
          <button className="primary" onClick={() => setIsOpen(true)}>
            <i className="fas fa-plus"></i>
            <span className="pl-2">New</span>
          </button>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                <Dialog.Panel className="w-full max-w-lg max-h-96 transform overflow-x-hidden overflow-y-auto rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <span>Rank name</span>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="col-span-2 bg-gray-200 rounded py-0.5 px-2 border-2 focus:border-purple-500 focus:bg-transparent font-medium" />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Rank color <span className="text-sm font-light">(HEX values only)</span></span>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className="col-span-2 bg-gray-200 rounded py-0.5 px-2 border-2 focus:border-purple-500 focus:bg-transparent font-medium" />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span>Admin rank</span>
                    <div onClick={() => setAdmin(prev => !prev)} className={`${admin ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${admin ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Delete posts</span>
                    <div onClick={() => setDeletePosts(prev => !prev)} className={`${deletePosts ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${deletePosts ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Delete users</span>
                    <div onClick={() => setDeleteUsers(prev => !prev)} className={`${deleteUsers ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${deleteUsers ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Hide posts</span>
                    <div onClick={() => setHidePosts(prev => !prev)} className={`${hidePosts ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${hidePosts ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Lock posts</span>
                    <div onClick={() => setLockPosts(prev => !prev)} className={`${lockPosts ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${lockPosts ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Delete topics</span>
                    <div onClick={() => setDeleteTopics(prev => !prev)} className={`${deleteTopics ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${deleteTopics ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Hide topics</span>
                    <div onClick={() => setHideTopics(prev => !prev)} className={`${hideTopics ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${hideTopics ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Lock topics</span>
                    <div onClick={() => setLockTopics(prev => !prev)} className={`${lockTopics ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${lockTopics ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Manage categories</span>
                    <div onClick={() => setManageCategories(prev => !prev)} className={`${manageCategories ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${manageCategories ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Manage roles</span>
                    <div onClick={() => setManageRoles(prev => !prev)} className={`${manageRoles ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${manageRoles ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Verify users</span>
                    <div onClick={() => setVerifyUsers(prev => !prev)} className={`${verifyUsers ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${verifyUsers ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Access dashboard</span>
                    <div onClick={() => setAccessDashboard(prev => !prev)} className={`${accessDashboard ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${accessDashboard ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Mmanage settings</span>
                    <div onClick={() => setManageSettings(prev => !prev)} className={`${manageSettings ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${manageSettings ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Restore users</span>
                    <div onClick={() => setRestoreUsers(prev => !prev)} className={`${restoreUsers ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${restoreUsers ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Ban users</span>
                    <div onClick={() => setBanUsers(prev => !prev)} className={`${banUsers ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${banUsers ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="flex items-center mt-6 justify-end">
                    <button className="primary" onClick={createRank}>Create</button>
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

export default Roles