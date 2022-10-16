import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { Dialog, Transition } from '@headlessui/react'
import { useEffect, useState, Fragment } from "react"
import PageLoading from "../../components/PageLoading"
import TempLoading from "../../components/TempLoading"
import HeadInfo from "../../components/Head"
import formatDate from "../../utils/formatDate"

const Topic = ({ data: _, catInfo }) => {
  const { data: session } = useSession()
  const [user, setUser] = useState({})
  const getUser = async () => {
    await fetch(`/api/membersApi/getUserById?user_id=${_?.userId}`)
      .then(res => res.json())
      .then(data => data?.data != 'null' && setUser(data?.data))
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <>
      <div className="grid grid-cols-7 border-b-2 last:border-b-0 p-3" style={{ borderBottomColor: catInfo?.theme }}>
        <div className="col-span-3">
          {_?.isLocked && <i className="fas fa-lock pr-2 text-black dark:text-white"></i>}
          <Link href='/posts/[id]' as={`/posts/${_?.id}`}>
            <span className="cursor-pointer hover:underline">{_?.title}</span>
          </Link>
        </div>
        <div className="col-span-1 text-center">{_?.posts?.length}</div>
        {session?.user && <Link href='/profile/[id]' as={`/profile/${user?.id}`}>
          <div className="col-span-1 text-center cursor-pointer hover:underline" style={{ color: user?.rank?.color }}>{user?.username}</div>
        </Link> || <div className="col-span-1 text-center" style={{ color: user?.rank?.color }}>{user?.username}</div>}
        <div className="col-span-2 text-right">
          {`${formatDate(_?.createdAt).MONTH} ${formatDate(_?.createdAt).DAY}, ${formatDate(_?.createdAt).YEAR} at ${formatDate(_?.createdAt).HOURS}:${formatDate(_?.createdAt).MINUTES}`}
        </div>
      </div>
    </>
  )
}

const max = 10
const Category = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const cat_id = router.query?.id
  const [catInfo, setCatInfo] = useState({})
  const [topicsList, setTopicsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [tempLoading, setTempLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const [passwordUnlocked, setPasswordUnlocked] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [password, setPassword] = useState('')
  const [index, setIndex] = useState(1)
  const [topics, setTopics] = useState([])
  const [pages, setPages] = useState([])
  const getTopics = async () => {
    setLoading(true)
    await fetch(`/api/topics/getTopics?id=${cat_id}`)
      .then(res => res.json())
      .then(data => data?.data && setTopicsList(data?.data))
    setLoading(false)
  }

  const getCategoryInfo = async () => {
    await fetch(`/api/categories/getCategoryById?id=${cat_id}`)
      .then(res => res.json())
      .then(data => data?.data && setCatInfo(data?.data))
  }

  const createTopic = async () => {
    if (title == '' || content == '') return
    setTempLoading(true)
    await fetch(`/api/topics/createTopic?cat_id=${cat_id}&user_id=${session?.user?.id}&title=${title}&content=${content}&locked=${locked}`)
      .then(res => res.json())
      .then(data => data?.success && setTimeout(() => router.push(`/posts/${data?.id}`), 0))
    setTempLoading(false)
  }

  const init = () => {
    if (topicsList.length < max) return setTopics(topicsList)
    const list = []
    const pagesList = []
    for (let i = ((index * max) - max); i < (index * max); i++) topicsList[i] && list.push(topicsList[i])
    for (let i = 1; i <= Math.floor(topicsList.length / max); i++) pagesList.push(i)
    setPages(pagesList)
    setTopics(list)
  }

  const checkPassword = async () => {
    if (password == '') return
    await fetch(`/api/categories/checkPassword?id=${cat_id}&pwd=${password}`)
      .then(res => res.json())
      .then(data => data?.success && setPasswordUnlocked(true) || setPassword(''))
  }

  useEffect(() => {
    if (!cat_id) return
    setLoading(true)
    getTopics()
    getCategoryInfo()
    setLoading(false)
  }, [cat_id])

  useEffect(() => {
    if (topicsList.length == 0) return
    init()
  }, [topicsList])

  useEffect(() => {
    if (topics.length == 0) return
    if ((topicsList.length - topics.length) < max && (topicsList.length - topics.length) > 0) setPages(l => [...l, pages.length + 1])
  }, [topics])

  useEffect(() => {
    init()
  }, [index])

  useEffect(() => {
    if (!catInfo) return
    if (catInfo?.password == '') setPasswordUnlocked(true)
  }, [catInfo])

  return (
    <>
      <HeadInfo title={catInfo?.name} titleFirst={true} />
      <PageLoading loading={loading} />
      <TempLoading loading={tempLoading} />
      {passwordUnlocked && <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-[9999]" onClose={() => setIsOpen(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div>
                      <label className="block pb-1" htmlFor="title">Title</label>
                      <input className="transition inline-block duration-100 col-span-2 bg-gray-300 border-gray-300 rounded-sm focus:bg-transparent border-2 h-fit px-2 py-1 focus:border-purple-600" type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="mt-4">
                      <label className="block pb-1">Post content</label>
                      <textarea className="transition w-full resize-none inline-block duration-100 col-span-2 bg-gray-300 border-gray-300 rounded-sm focus:bg-transparent border-2 h-28 px-2 py-1 focus:border-purple-600" value={content} onChange={e => setContent(e.target.value)}></textarea>
                    </div>
                    {session?.user?.rank?.lock_topics && <div className="mt-4 flex items-center justify-between">
                      <div>Lock Topic</div>
                      <div onClick={() => setLocked(prev => !prev)} className={`${locked ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
                        <span className="sr-only">Use setting</span>
                        <span aria-hidden="true" className={`${locked ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
                      </div>
                    </div>}
                    <div className="flex items-center justify-end mt-6">
                      <button onClick={() => createTopic()} className="primary text-sm">Create</button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
        <div className="px-3 py-1.5 text-white rounded-t-sm font-medium mt-6 flex items-center justify-between" style={{ backgroundColor: catInfo?.theme }}>
          <div>{catInfo?.name}</div>
          {session?.user && <div className="cursor-pointer" onClick={() => setIsOpen(true)}>Create Topic</div>}
        </div>
        <div className="grid grid-cols-7 border-2 border-t-0 py-1 px-3" style={{ borderColor: catInfo?.theme }}>
          <div className="col-span-3">Title</div>
          <div className="col-span-1 text-center">Replies</div>
          <div className="col-span-1 text-center">Author</div>
          <div className="col-span-2 text-right">Created</div>
        </div>
        <div className="border-2 border-t-0 rounded-b-sm" style={{ borderColor: catInfo?.theme }}>
          {topicsList.length == 0 && (
            <div className="text-center p-2">No topics on this category.</div>
          ) || topicsList.map(_ => <Topic key={_?.id} data={_} catInfo={catInfo} />)}
        </div>
        {pages.length > 0 && <div className="px-3 py-1 text-center bg-gray-100 dark:bg-gray-700 mt-2 rounded-sm">
          <button onClick={() => setIndex(prev => prev - 1)} disabled={index == 1} className="bg-purple-700 text-sm py-0.5 px-2 hover:bg-purple-700/70 mr-2"><i className="fas fa-caret-left"></i></button>
          {pages.map((_, i) => (
            <button className={`bg-purple-700 text-sm py-0.5 px-2 mr-2 ${index == _ ? 'bg-purple-700/70' : 'hover:bg-purple-700/70'}`} onClick={() => setIndex(_)} key={i}>{_}</button>
          ))}
          <button onClick={() => setIndex(prev => prev + 1)} disabled={index == pages.length} className="bg-purple-700 text-sm py-0.5 px-2 hover:bg-purple-700/70"><i className="fas fa-caret-right"></i></button>
        </div>}</> ||
        <>
          <div className="mt-6">
            <div className="px-3 py-1.5 text-white rounded-t-sm font-medium mt-6 flex items-center justify-between" style={{ backgroundColor: catInfo?.theme }}>
              <div>{catInfo?.name}</div>
            </div>
            <div className="border-2 border-t-0 py-2 px-3" style={{ borderColor: catInfo?.theme }}>
              <div className="mb-2">This category is password protected</div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="rounded border-2 border-transparent border-color-auto focus:bg-transparent focus:text-white bg-gray-300 text-black px-3 py-1" style={{ ['--theme']: catInfo?.theme }} />
              {password != '' && <button onClick={checkPassword} className="ml-2 btn-secondary">Continue</button>}
            </div>
          </div>
        </>}
    </>
  )
}

export default Category