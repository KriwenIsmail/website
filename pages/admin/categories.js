import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { Dialog, Transition } from '@headlessui/react'
import { useEffect, useState, Fragment, useRef } from "react"
import TempLoading from "../../components/TempLoading"
import Select from "../../components/Select"
import pushLog from "../../utils/pushLog"

const orderData = (list, orderBy) => {
  const arr = []
  list.map(_ => arr[_[orderBy] - 1] = _)
  return arr
}

const Category = ({ cat, setLoading, reload, catLength }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const passwordRef = useRef(null)
  const iconRef = useRef(null)
  const [theme, setTheme] = useState(cat?.theme)
  const [name, setName] = useState(cat?.name)
  const [description, setDescription] = useState(cat?.description)
  const [password, setPassword] = useState(cat?.password)
  const [isVisible, setIsVisible] = useState(cat?.isVisible)
  const [adminsOnly, setAdminsOnly] = useState(cat?.adminsOnly)
  const [allowGuests, setAllowGuests] = useState(cat?.allowGuests)
  const [allowedGroups, setAllowedGroups] = useState(cat?.allowedGroups)
  const [ranksList, setRanksList] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [groupSelectionIsOpen, setGroupSelectionIsOpen] = useState(false)
  const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = useState(false)
  const updateCategory = async () => {
    setLoading(true)
    if (theme != '' && theme != cat?.theme && theme.includes('#')) {
      await fetch(`/api/categories/updateTheme?id=${cat?.id}&theme=${theme.split('#')[1]}`)
      pushLog(`${session?.user?.username} updated ${cat?.name}'s theme to ${theme}`)
    }
    if (name != '' && name != cat?.name) {
      await fetch(`/api/categories/updateName?id=${cat?.id}&name=${name}`)
      pushLog(`${session?.user?.username} updated ${cat?.name}'s name to ${name}`)
    }
    if (description != '' && description != cat?.description) {
      await fetch(`/api/categories/updateDescription?id=${cat?.id}&description=${description}`)
      pushLog(`${session?.user?.username} updated ${cat?.name}'s description to ${description}`)
    }
    if (password != cat?.password) {
      await fetch(`/api/categories/updatePassword?id=${cat?.id}&password=${password}`)
      pushLog(`${session?.user?.username} updated ${cat?.name}'s password`)
    }
    if (isVisible != isVisible?.theme) {
      await fetch(`/api/categories/updateIsVisible?id=${cat?.id}&value=${isVisible}`)
      pushLog(`${session?.user?.username} changed ${cat?.name}'s visibility to ${isVisible ? 'visible' : 'invisible'}`)
    }
    if (adminsOnly != cat?.adminsOnly) {
      await fetch(`/api/categories/updateAdminsOnly?id=${cat?.id}&value=${adminsOnly}`)
      pushLog(`${session?.user?.username} changed ${cat?.name}'s admin accessibility to ${adminsOnly ? 'admins only' : 'public'}`)
    }
    if (allowGuests != cat?.allowGuests) {
      await fetch(`/api/categories/updateAllowGuests?id=${cat?.id}&value=${allowGuests}`)
      pushLog(`${session?.user?.username} ${allowGuests ? 'allowed' : 'disallowed'} guests to view ${cat?.name}`)
    }
    if (allowedGroups != cat?.allowedGroups) {
      await fetch(`/api/categories/updateAllowedGroups?id=${cat?.id}&value=${allowedGroups}`)
      if (JSON.parse(allowedGroups).length == 0) pushLog(`${session?.user?.username} removed group specification from ${cat?.name}`)
      else {
        let groups = ''
        JSON.parse(allowedGroups).map(_ => groups += `'${_}', `)
        pushLog(`${session?.user?.username} allowed ${groups}to access ${cat?.name}`)
      }
    }
    setLoading(false)
  }

  const togglePassword = () => {
    if (passwordRef.current == null || iconRef.current == null) return
    if (passwordRef.current?.getAttribute('type') == 'password') {
      passwordRef.current?.setAttribute('type', 'text')
      iconRef.current?.classList.replace('fa-eye-slash', 'fa-eye')
    } else {
      passwordRef.current?.setAttribute('type', 'password')
      iconRef.current?.classList.replace('fa-eye', 'fa-eye-slash')
    }
  }

  const getRanks = async () => {
    await fetch('/api/membersApi/getRanks')
      .then(res => res.json())
      .then(data => setRanksList(data?.data))
  }

  const updateAllowedGroups = group_name => {
    const list = JSON.parse(allowedGroups)
    if (list.includes(group_name)) {
      const newList = list
      list.splice(list.indexOf(group_name), 1)
      setAllowedGroups(JSON.stringify(newList))
    } else {
      const newList = list
      newList.push(group_name)
      setAllowedGroups(JSON.stringify(newList))
    }
  }

  const deleteCategory = async () => {
    setLoading(true)
    await fetch(`/api/categories/deleteCategory?id=${cat?.id}`)
      .then(res => res.json())
      .then(() => {
        pushLog(`${session?.user?.username} deleted ${cat?.name}`)
        setTimeout(() => reload(true), 0)
      })
    setLoading(false)
  }

  const moveUp = async () => {
    if (cat?.order == 1) return
    await fetch(`/api/categories/moveUp?id=${cat?.id}&index=${cat?.order}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          pushLog(`${session?.user?.username} moved ${cat?.name} up`)
          reload(true)
        }
      })
  }

  const moveDown = async () => {
    if (cat?.order == catLength) return
    await fetch(`/api/categories/moveDown?id=${cat?.id}&index=${cat?.order}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          pushLog(`${session?.user?.username} moved ${cat?.name} down`)
          reload(true)
        }
      })
  }

  useEffect(() => {
    if (!groupSelectionIsOpen) return
    setLoading(true)
    getRanks()
    setLoading(false)
  }, [groupSelectionIsOpen])

  return (
    <>
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <textarea value={description} className="w-full h-32 resize-none p-2 rounded border-2 transition duration-100 bg-gray-300 border-gray-300 focus:border-purple-600 focus:bg-transparent" onChange={e => setDescription(e.target.value)}></textarea>
                  <div className="my-2 flex items-center justify-between">
                    <label>Allow guests to view this category</label>
                    <div onClick={() => setAllowGuests(prev => !prev)} className={`${allowGuests ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${allowGuests ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="block pb-1">Password <span className="text-sm italic">(optional)</span></label>
                    <input className="transition inline-block duration-100 col-span-2 bg-gray-300 border-gray-300 rounded focus:bg-transparent border-2 h-fit px-2 py-1 focus:border-purple-600" ref={passwordRef} type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button onClick={togglePassword} className="ml-2 bg-purple-700 hover:bg-purple-700/70">
                      <i className="fas fa-eye-slash" ref={iconRef}></i>
                    </button>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <label>Allow specific groups to access this category</label>
                    <button className="primary mt-2" onClick={() => setGroupSelectionIsOpen(true)}>Edit</button>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <button className="dark mr-2 text-sm" onClick={moveUp} disabled={cat?.order == 1}><i className="fas fa-caret-up"></i></button>
                        <button className="dark text-sm" onClick={moveDown} disabled={cat?.order == catLength}><i className="fas fa-caret-down"></i></button>
                      </div>
                      <button className="danger" onClick={() => setDeleteConfirmationIsOpen(true)}>Delete</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={groupSelectionIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[10000]" onClose={() => setGroupSelectionIsOpen(false)}>
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
                  <div>
                    {ranksList.map(_ =>
                      <div key={_?.id} className="flex items-center justify-between mb-2 last:mb-0">
                        <span className="pl-4 font-medium text-lg">{_?.name}</span>
                        <button onClick={() => updateAllowedGroups(_?.name)} className={`${JSON.parse(allowedGroups).includes(_?.name) ? 'danger' : 'primary'} text-sm`}>{JSON.parse(allowedGroups).includes(_?.name) ? 'remove' : 'add'}</button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={deleteConfirmationIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[10002]" onClose={() => setDeleteConfirmationIsOpen(false)}>
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
                  <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-gray-900">
                    <i className="fas fa-triangle-exclamation"></i><span> Delete account?</span>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md text-gray-500">
                      Are you sure you want to delete this category?
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <button type="button" className="danger mr-2" onClick={() => deleteCategory()}>
                      Yes
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setDeleteConfirmationIsOpen(false)}>
                      No
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="grid grid-cols-9 gap-5 mb-2 place-items-center">
        <input className="transition duration-100 inline-block col-span-3 bg-gray-300 border-gray-300 rounded focus:bg-transparent border-2 h-fit px-2 py-1 focus:border-purple-600 dark:text-black dark:focus:text-white" type="text" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" className="transition duration-100 inline-block col-span-2 bg-gray-300 border-gray-300 rounded focus:bg-transparent border-2 h-fit px-2 py-1 focus:border-purple-600 dark:text-black dark:focus:text-white" value={theme} onChange={e => setTheme(e.target.value)} />
        <div onClick={() => setIsVisible(prev => !prev)} className={`${isVisible ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
          <span className="sr-only">Use setting</span>
          <span aria-hidden="true" className={`${isVisible ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
        </div>
        <div onClick={() => setAdminsOnly(prev => !prev)} className={`${adminsOnly ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
          <span className="sr-only">Use setting</span>
          <span aria-hidden="true" className={`${adminsOnly ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
        </div>
        <button className="btn-secondary col-span-1 h-fit" onClick={() => setIsOpen(true)}>More</button>
        <button onClick={() => updateCategory()} className="ml-2 success col-span-1 h-fit">Save</button>
      </div>
    </>
  )
}

const Categories = () => {
  const { data: session } = useSession()
  const pwdRef = useRef(null)
  const iconRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [ranksList, setRanksList] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [allowGuests, setAllowGuests] = useState(false)
  const [allowedGroups, setAllowedGroups] = useState("[]")
  const [groupSelectionIsOpen, setGroupSelectionIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#000000')
  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [adminsOnly, setAdminsOnly] = useState(false)
  const [reload, setReload] = useState(false)
  const getCategories = async () => {
    await fetch('/api/categories/getCategories')
      .then(res => res.json())
      .then(data => setCategories(orderData(data?.data, 'order')))
  }

  const togglePassword = () => {
    if (pwdRef.current == null || iconRef.current == null) return
    if (pwdRef.current?.getAttribute('type') == 'password') {
      pwdRef.current?.setAttribute('type', 'text')
      iconRef.current?.classList.replace('fa-eye-slash', 'fa-eye')
    } else {
      pwdRef.current?.setAttribute('type', 'password')
      iconRef.current?.classList.replace('fa-eye', 'fa-eye-slash')
    }
  }

  const getRanks = async () => {
    await fetch('/api/membersApi/getRanks')
      .then(res => res.json())
      .then(data => setRanksList(data?.data))
  }

  const updateAllowedGroups = group_name => {
    const list = JSON.parse(allowedGroups)
    if (list.includes(group_name)) {
      const newList = list
      list.splice(list.indexOf(group_name), 1)
      setAllowedGroups(JSON.stringify(newList))
    } else {
      const newList = list
      newList.push(group_name)
      setAllowedGroups(JSON.stringify(newList))
    }
  }

  const addCategory = async () => {
    if (title == '' || color == '' || !color.includes('#') || color.length > 7 || color.length < 7) return
    setLoading(true)
    const cat_data = JSON.stringify({ title, theme: color.split('#')[1], description, password, isVisible, adminsOnly, allowGuests, allowedGroups })
    await fetch(`/api/categories/addCategory?data=${cat_data}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          pushLog(`${session?.user?.username} created a new category with ID: ${data?.data?.id} & name: ${title}`)
          getCategories()
          setIsOpen(false)
        }
      })
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getCategories()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!reload) return
    setLoading(true)
    getCategories()
    setReload(false)
    setLoading(false)
  }, [reload])

  useEffect(() => {
    if (!groupSelectionIsOpen) return
    setLoading(true)
    getRanks()
    setLoading(false)
  }, [groupSelectionIsOpen])

  return (
    <>
      <TempLoading loading={loading} />
      {categories.map(_ => <Category cat={_} setLoading={setLoading} key={_?.id} reload={setReload} catLength={categories.length} />)}
      <div className="mt-2 flex items-center justify-end">
        <button className="primary" onClick={() => setIsOpen(true)}>
          <i className="fas fa-plus"></i>
          <span className="pl-2">New</span>
        </button>
        <button onClick={() => setReload(true)} className="btn-secondary ml-2">
          <i className="fas fa-rotate-right"></i>
        </button>
      </div>
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div>
                    <label htmlFor="new_title" className="block pb-1">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="transition duration-100 inline-block col-span-2 bg-gray-300 border-gray-300 rounded-sm focus:bg-transparent border-2 h-fit px-2 py-1 focus:border-purple-600" id="new_title" />
                  </div>
                  <div className="mt-2">
                    <label htmlFor="new_description" className="block">Description</label>
                    <textarea value={description} id="new_description" className="w-full h-14 resize-none p-2 rounded-sm border-2 transition duration-100 bg-gray-300 border-gray-300 focus:border-purple-600 focus:bg-transparent" onChange={e => setDescription(e.target.value)}></textarea>
                  </div>
                  <div className="mt-2">
                    <label htmlFor="new_color" className="block pb-1">Color <span className="italic text-sm">(HEX values only)</span></label>
                    <input type="text" value={color} onChange={e => setColor(e.target.value)} className="transition duration-100 inline-block col-span-2 bg-gray-300 border-gray-300 rounded-sm focus:bg-transparent border-2 h-fit px-2 py-1 focus:border-purple-600" id="new_color" />
                  </div>
                  <div className="mt-2">
                    <label htmlFor="new_password" className="block pb-1">Password <span className="italic text-sm">(optional)</span></label>
                    <input type="password" ref={pwdRef} value={password} onChange={e => setPassword(e.target.value)} className="transition duration-100 inline-block col-span-2 bg-gray-300 border-gray-300 rounded-sm focus:bg-transparent border-2 h-fit px-2 py-1 focus:border-purple-600" id="new_password" />
                    <button onClick={togglePassword} className="ml-2 bg-purple-700 hover:bg-purple-700/70">
                      <i className="fas fa-eye-slash" ref={iconRef}></i>
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-5">
                    <div className="col-span-1 flex items-center justify-between">
                      <span>Visible</span>
                      <button onClick={() => setIsVisible(prev => !prev)} className={`text-sm ${isVisible ? 'bg-green-600 hover:bg-green-600/70' : 'danger'}`}>{isVisible ? 'Yes' : 'No'}</button>
                    </div>
                    <div className="col-span-1 flex items-center justify-between">
                      <span>Admins only</span>
                      <button onClick={() => setAdminsOnly(prev => !prev)} className={`text-sm ${adminsOnly ? 'bg-green-600 hover:bg-green-600/70' : 'danger'}`}>{adminsOnly ? 'Yes' : 'No'}</button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label>Allow guests to view this category</label>
                    <div onClick={() => setAllowGuests(prev => !prev)} className={`${allowGuests ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`${allowGuests ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <label>Allow specific groups to access this category</label>
                    <button className="primary text-sm" onClick={() => setGroupSelectionIsOpen(true)}>Edit</button>
                    <Transition appear show={groupSelectionIsOpen} as={Fragment}>
                      <Dialog as="div" className="relative z-[10000]" onClose={() => setGroupSelectionIsOpen(false)}>
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
                                <div>
                                  {ranksList.map(_ =>
                                    <div key={_?.id} className="flex items-center justify-between mb-2 last:mb-0">
                                      <span className="pl-4 font-medium text-lg">{_?.name}</span>
                                      <button onClick={() => updateAllowedGroups(_?.name)} className={`${JSON.parse(allowedGroups).includes(_?.name) ? 'danger' : 'primary'} text-sm`}>{JSON.parse(allowedGroups).includes(_?.name) ? 'remove' : 'add'}</button>
                                    </div>
                                  )}
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                      </Dialog>
                    </Transition>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <button onClick={() => addCategory()} className="success text-sm">Confirm</button>
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

export default Categories