import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { Dialog, Transition, Menu } from '@headlessui/react'
import { useEffect, useState, Fragment } from "react"
import PageLoading from "../../components/PageLoading"
import TempLoading from "../../components/TempLoading"
import HeadInfo from "../../components/Head"
import formatDate from "../../utils/formatDate"
import pushLog from "../../utils/pushLog"

const QuotePost = ({ data }) => {
  const [user, setUser] = useState({})
  const [post, setPost] = useState({})
  const getUser = async () => {
    await fetch(`/api/membersApi/getUserById?user_id=${post?.userId}`)
      .then(res => res.json())
      .then(data => data?.data != 'null' && setUser(data?.data))
  }

  const getPost = async () => {
    if (!data?.id) return
    await fetch(`/api/posts/getPostById?id=${data?.quote}`)
      .then(res => res.json())
      .then(data => data?.data && setPost(data?.data[0]))
  }

  useEffect(() => {
    getPost()
  }, [])

  useEffect(() => {
    if (!post || !post?.userId) return
    getUser()
  }, [post])

  return (
    <>
      <div className="rounded py-2 px-3 text-sm border-2 border-black my-2">
        <div className="text-white flex items-center justify-start">
          <Link href='/profile/[id]' as={`/profile/${user?.id}`}>
            <div className="hover:underline cursor-pointer pr-1" style={{ color: user?.rank?.color }}>{user?.username}</div>
          </Link>
          <div className="pl-2 text-xs">
            <i className="fas fa-clock"></i>
            <span className="pl-2 italic">
              {post?.createdAt && `${formatDate(post?.createdAt).MONTH} ${formatDate(post?.createdAt).DAY}, ${formatDate(post?.createdAt).YEAR} at ${formatDate(post?.createdAt).HOURS}:${formatDate(post?.createdAt).MINUTES}`}
            </span>
          </div>
        </div>
        <div className="text-base pt-2 pl-2">
          {post?.content}
        </div>
      </div>
      {data?.content}
    </>
  )
}

const SepLink = ({ data }) => {
  return <Link href='/profile/[id]' as={`/profile/${data?.id}`}>
    <span className="cursor-pointer hover:underline" style={{ color: data?.color }}>{data?.name}</span>
  </Link>
}

const Convert = ({ content, tags }) => {
  const [users, setUsers] = useState([])
  const [post, setPost] = useState(content)
  const check = () => typeof tags == 'object' && tags.map(_ => getUserByName(_))
  const getUserByName = async (name) => {
    await fetch(`/api/membersApi/getUserByName?name=${name}`)
      .then(res => res.json())
      .then(res => {
        if (!res.data) return
        const data = {}
        data.id = res.data?.id
        data.name = res.data?.name
        data.color = res.data?.rank.color
        if (!users.includes(data)) setUsers(list => [...list, data])
      })
  }

  const convert = () => {
    if (users.length == 0) return
    users.map(_ => {
      if (post.includes(`@${_?.name}`)) {
        return
      }
    })
  }

  useEffect(() => {
    if (tags.length == 0) return
    setUsers([])
    check()
  }, [])

  useEffect(() => {
    if (post == '') return
    // convert()
  }, [post])

  return (
    <>
      {users.map((_, i) => (
        post.includes(`@${_?.name}`) && <span key={i}><SepLink data={_} /> {post}</span>
      ))}
    </>
  )
}

const Post = ({ data, loading, reload, topic_id }) => {
  const { data: session } = useSession()
  const [user, setUser] = useState({})
  const [avatar, setAvatar] = useState('/assets/avatars/default.jpg')
  const [isOpen, setIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [newContent, setNewContent] = useState(data?.content)
  const [content, setContent] = useState('')
  const [quote, setQuote] = useState(0)
  const getUser = async () => {
    if (!data?.userId) return
    await fetch(`/api/membersApi/getUserById?user_id=${data?.userId}`)
      .then(res => res.json())
      .then(data => data?.data != 'null' && setUser(data?.data))
  }

  const createPost = async () => {
    if (content == '') return
    loading(true)
    await fetch(`/api/posts/createPost?content=${content}&poster=${session?.user?.id}&topicId=${topic_id}&quote=${quote}&quoteUserId=${data?.userId}`)
      .then(res => res.json())
      .then(data => data?.data && reload(true))
    loading(false)
    setIsOpen(false)
    setContent('')
    setQuote(0)
  }

  const deletePost = async () => {
    await fetch(`/api/posts/deletePost?id=${data?.id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          pushLog(`${session?.user?.username} deleted post '${data?.content}'`)
          setTimeout(() => reload(true), 0)
        }
      })
  }

  const editPost = async () => {
    if (newContent == '' || newContent == data?.content) return
    await fetch(`/api/posts/editPost?id=${data?.id}&content=${newContent}`)
      .then(res => res.json())
      .then(data => data?.success && (setTimeout(() => reload(true), 0), setEditIsOpen(false)))
  }

  const visibility = async () => {
    await fetch(`/api/posts/editPostVisibility?id=${data?.id}&value=${data?.isHidden}`)
      .then(res => res.json())
      .then(data => data?.success && setTimeout(() => reload(true), 0))
  }

  const getLikes = async () => {
    await fetch(`/api/posts/likes/getLikes?post_id=${data?.id}`)
      .then(res => res.json())
  }

  const likePost = async () => {
    await fetch(`/api/posts/likes/likePost?post_id=${data?.id}&user_id=${session?.user?.id}`)
      .then(res => res.json())
  }

  useEffect(() => {
    loading(true)
    getUser()
    getLikes()
    loading(false)
  }, [])

  useEffect(() => {
    if (!user || !user.avatar) return
    setAvatar(`/assets/avatars/${user?.avatar}`)
  }, [user])

  return (
    <>
      <Transition appear show={deleteIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={() => setDeleteIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-gray-900">
                    <i className="fas fa-triangle-exclamation"></i><span> Delete post?</span>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md text-gray-500">
                      Are you sure you want to delete this post?
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-end text-sm">
                    <button type="button" className="danger mr-2" onClick={() => deletePost()}>
                      Yes
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setDeleteIsOpen(false)}>
                      No
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
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
                    <label className="block pb-1">
                      Replying to <Link href='/profile/[id]' as={`/profile/${user?.id}`}><span className="hover:underline cursor-pointer" style={{ color: user?.rank?.color }}>{user?.username}</span></Link>:</label>
                    <div className="italic pl-2">{data?.content}</div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="content" className="block pb-1">Content</label>
                    <textarea className="bg-gray-200 rounded py-1 px-2 border-2 resize-none w-full h-24 focus:border-purple-500 focus:bg-transparent font-medium inline-block dark:text-black" id="content" value={content} onChange={e => setContent(e.target.value)}></textarea>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <button onClick={() => createPost()} className="primary text-sm">Create</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={editIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={() => setEditIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div>
                    <textarea className="bg-gray-200 rounded py-1 px-2 border-2 resize-none w-full h-24 focus:border-purple-500 focus:bg-transparent font-medium inline-block dark:text-black" value={newContent} onChange={e => setNewContent(e.target.value)}></textarea>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <button onClick={() => editPost()} className="primary text-sm">Edit</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className={`grid grid-cols-4 gap-3 mt-2 ${data?.isHidden && 'border-2 rounded-md border-red-600'}`}>
        <div className="hidden relative dark:bg-gray-700 bg-gray-100 rounded-md sm:col-span-1 sm:flex p-2 justify-center flex-col">
          {user?.rank?.admin && <div className="absolute w-5 aspect-square top-2 right-2">
            <Image width='100%' height='100%' layout='responsive' loading='lazy' src={'/assets/icons/admin.png'} objectFit='cover' />
          </div>}
          <Link href='/profile/[id]' as={`/profile/${user?.id}`}>
            <div className="cursor-pointer hover:underline px-3" style={{ color: user?.rank?.color }}>{user?.username}</div>
          </Link>
          <div className="px-3">{user?.rank?.name}</div>
          <div className="w-[90%] h-46 mx-auto py-3">
            <Image width='100%' height='100%' layout='responsive' loading='lazy' src={avatar} objectFit='cover' />
          </div>
          {user?.online && <div className="text-center pb-1 font-medium text-sky-500">User is currently online</div>}
          <div className="flex items-center justify-between px-3">
            <div>Posts: <span className="font-medium">{user?.posts?.length}</span></div>
            <div>Likes: <span className="font-medium">{user?.likes}</span></div>
          </div>
          <div className="italic font-light text-center pt-2">
            {user?.bio}
          </div>
        </div>
        <div className="col-span-4 sm:col-span-3 dark:bg-gray-700 bg-gray-100 rounded-md p-2">
          <div className="p-1 pb-2 text-xs flex items-center justify-between border-b-2 dark:border-b-white">
            <div className="pl-2">
              <i className="fas fa-clock"></i>
              <span className="pl-2 italic">
                {data?.createdAt && `${formatDate(data?.createdAt).MONTH} ${formatDate(data?.createdAt).DAY}, ${formatDate(data?.createdAt).YEAR} at ${formatDate(data?.createdAt).HOURS}:${formatDate(data?.createdAt).MINUTES}`}
                {JSON.parse(data?.likes).length > 0 && <div className="inline-block pl-3">
                  <i className="fas fa-thumbs-up"></i> {JSON.parse(data?.likes).length}
                </div>}
              </span>
            </div>
            {session?.user && <div className="pr-2">
              <button onClick={() => { setIsOpen(true); setQuote(data?.id) }} className="bg-gray-300 hover:bg-gray-300/70 px-2 mr-2">
                <i className="fas fa-quote-left"></i>
              </button>
              <button disabled={data?.userId == session?.user?.id} onClick={() => likePost()} className="bg-gray-300 hover:bg-gray-300/70 px-2 mr-2">
                <i className={`fas fa-thumbs-up ${JSON.parse(data?.likes).includes(session?.user?.id) && 'text-blue-500'}`}></i>
              </button>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="bg-gray-300 hover:bg-gray-300/70 px-2">
                    <i className="fas fa-cog"></i>
                  </Menu.Button>
                </div>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className="absolute right-0 mt-1 w-40 origin-top-right divide-y divide-gray-100 rounded bg-white shadow-lg">
                    <div className="p-1">
                      {(session?.user?.id == data?.userId) && <Menu.Item>
                        {({ active }) => (
                          <button onClick={() => setEditIsOpen(true)} className={`${active && 'bg-gray-300'} text-gray-900 group flex w-full items-center rounded-md px-3 py-1 text-sm`}>
                            <i className="fas fa-pen pr-2"></i> Edit
                          </button>
                        )}
                      </Menu.Item>}
                      {session?.user?.rank?.hide_posts && <Menu.Item>
                        {({ active }) => (
                          <button onClick={() => visibility()} className={`${active && 'bg-gray-300'} text-gray-900 group flex w-full items-center rounded-md px-3 py-1 text-sm`}>
                            {data?.isHidden ? (<><i className="fas fa-eye pr-2"></i>Show</>) : (<><i className="fas fa-eye-slash pr-2"></i>Hide</>)}
                          </button>
                        )}
                      </Menu.Item>}
                    </div>
                    {(session?.user?.rank?.delete_posts || session?.user?.id == data?.userId) && <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={() => setDeleteIsOpen(true)} className={`${active && 'bg-gray-300'} text-gray-900 group flex w-full items-center rounded-md px-3 py-1 text-sm`}>
                            <i className="fas fa-trash pr-2"></i> Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>}
          </div>
          <div className="py-2 px-3">
            {/* {data?.quote == 0 && <Convert content={data?.content} tags={JSON.parse(data?.tags)} /> || <QuotePost data={data} />} */}
            {data?.quote == 0 && data?.content || <QuotePost data={data} />}
          </div>
        </div>
      </div>
    </>
  )
}

const max = 10
const Posts = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const topic_id = router.query?.id
  const [loading, setLoading] = useState(true)
  const [tempLoading, setTempLoading] = useState(false)
  const [postsList, setPostsList] = useState([])
  const [info, setInfo] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [reload, setReload] = useState(false)
  const [index, setIndex] = useState(1)
  const [posts, setPosts] = useState([])
  const [pages, setPages] = useState([])
  const [tags, setTags] = useState([])
  const [users, setUsers] = useState([])
  const getPosts = async () => {
    await fetch(`/api/posts/getPosts?topic_id=${topic_id}`)
      .then(res => res.json())
      .then(data => data?.data && setPostsList(data?.data))
  }

  const getUsers = async () => {
    await fetch(`/api/membersApi/getAllUsers`)
      .then(res => res.json())
      .then(data => data?.data && setUsers(data?.data))
  }

  const getCategoryTheme = async (id, title, locked) => {
    await fetch(`/api/categories/getCategoryById?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setInfo({ title, theme: data?.data?.theme, locked })
        }
      })
  }

  const getTopicInfo = async () => {
    await fetch(`/api/topics/getTopicById?id=${topic_id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          getCategoryTheme(data?.data?.categoryId, data?.data?.title, data?.data?.isLocked)
        }
      })
  }

  const checkTags = () => {
    if (content == '' || !content.includes('@')) return
    users.map(_ => {
      if (content.includes(`@${_?.name}`) && !tags.includes(_?.name)) {
        const newList = tags
        newList.push(_?.name)
        setTags(newList)
      }
    })
  }

  const createPost = async () => {
    if (content == '') return
    setTempLoading(true)
    checkTags()
    await fetch(`/api/posts/createPost?content=${content}&poster=${session?.user?.id}&topicId=${topic_id}&tags=${JSON.stringify(tags)}`)
      .then(res => res.json())
      .then(data => data?.data && setReload(true))
    setTempLoading(false)
    setIsOpen(false)
    setContent('')
  }

  const init = () => {
    if (postsList.length < max) return setPosts(postsList)
    const list = []
    const pagesList = []
    for (let i = ((index * max) - max); i < (index * max); i++) postsList[i] && list.push(postsList[i])
    for (let i = 1; i <= Math.floor(postsList.length / max); i++) pagesList.push(i)
    setPages(pagesList)
    setPosts(list)
  }

  useEffect(() => {
    setLoading(true)
    getUsers()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!reload) return
    setLoading(true)
    getPosts()
    setLoading(false)
    setReload(false)
  }, [reload])

  useEffect(() => {
    if (!topic_id) return
    getPosts()
    getTopicInfo()
    setLoading(false)
  }, [topic_id])

  useEffect(() => {
    if (postsList.length == 0) return
    init()
  }, [postsList])

  useEffect(() => {
    if (posts.length == 0) return
    if ((postsList.length - posts.length) < max && (postsList.length - posts.length) > 0) setPages(l => [...l, pages.length + 1])
  }, [posts])

  useEffect(() => {
    init()
  }, [index])

  return (
    <>
      <PageLoading loading={loading} />
      <TempLoading loading={tempLoading} />
      <HeadInfo title={info?.title} titleFirst={true} />
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
                    <label htmlFor="content" className="block pb-1">Content</label>
                    <textarea className="resize-none w-full h-24 bg-gray-200 rounded py-1 px-2 border-2 focus:border-purple-500 focus:bg-transparent font-medium inline-block dark:text-black" id="content" value={content} onChange={e => setContent(e.target.value)}></textarea>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <button onClick={() => createPost()} className="primary text-sm">Create</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="px-3 text-white py-1.5 rounded-sm font-medium mt-6 flex items-center justify-between" style={{ backgroundColor: info?.theme }}>
        <div>{info?.title}</div>
        {((session?.user && !info?.locked) || session?.user?.rank?.lock_topics) && <div className="cursor-pointer" onClick={() => setIsOpen(true)}>Add Post</div>}
      </div>
      {pages.length > 0 && <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 mt-2 rounded-sm">
        <button onClick={() => setIndex(prev => prev - 1)} disabled={index == 1} className="bg-purple-700 text-sm py-0.5 px-2 hover:bg-purple-700/70 mr-2"><i className="fas fa-caret-left"></i></button>
        {pages.map((_, i) => (
          <button className={`bg-purple-700 text-sm py-0.5 px-2 mr-2 ${index == _ ? 'bg-purple-700/70' : 'hover:bg-purple-700/70'}`} onClick={() => setIndex(_)} key={i}>{_}</button>
        ))}
        <button onClick={() => setIndex(prev => prev + 1)} disabled={index == pages.length} className="bg-purple-700 text-sm py-0.5 px-2 hover:bg-purple-700/70"><i className="fas fa-caret-right"></i></button>
      </div>}
      {posts.map(_ => (!_?.isHidden || session?.user?.rank?.admin) && <Post key={_?.id} data={_} reload={setReload} loading={setTempLoading} topic_id={topic_id} />)}
    </>
  )
}

export default Posts