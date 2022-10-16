import Link from "next/link"
import Image from "next/image"
import { useSession, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import HeadInfo from "../../../components/Head"
import Head from "next/head"
import { Transition, Dialog } from "@headlessui/react"
import { useEffect, useState, Fragment } from "react"
import PageLoading from "../../../components/PageLoading"
import TempLoading from "../../../components/TempLoading"

const Profile = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const current_profile_id = router.query?.id
  const [info, setInfo] = useState({})
  const [user, setUser] = useState(null)
  const [avatar, setAvatar] = useState('/assets/avatars/default.jpg')
  const [loading, setLoading] = useState(true)
  const [tempLoading, setTempLoading] = useState(false)
  const [reportIsOpen, setReportIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const getUserById = async () => {
    await fetch(`/api/membersApi/getUserById?user_id=${current_profile_id}`)
      .then(res => res.json())
      .then(data => setUser(data?.data))
  }

  const verifyUser = async () => {
    setTempLoading(true)
    if (session?.user?.rank?.admin) {
      await fetch(`/api/moderateUser/verifyUserById?user_id=${current_profile_id}`)
        .then(res => res.json())
        .then(data => data?.success && router.reload())
    }
    setTempLoading(false)
  }

  const deleteUser = async () => {
    setTempLoading(true)
    if (session?.user?.rank?.admin) {
      await fetch(`/api/moderateUser/deleteUserId?user_id=${current_profile_id}`)
        .then(res => res.json())
        .then(data => data?.success && router.push('/'))
    }
    setTempLoading(false)
  }

  const reportUser = async () => {
    setTempLoading(true)
    await fetch(`/api/membersApi/report?content=${content}&reporter=${session?.user?.id}&reported=${user?.id}`)
    setTempLoading(false)
    setContent('')
    setReportIsOpen(false)
  }

  const banUser = async () => {
    await fetch(`/api/moderateUser/ban?id=${user?.id}`)
      .then(res => res.json())
      .then(data => data?.success && setTimeout(() => router.reload(), 0))
  }

  const unbanUser = async () => {
    await fetch(`/api/moderateUser/unban?id=${user?.id}`)
      .then(res => res.json())
      .then(data => data?.success && setTimeout(() => router.reload(), 0))
  }

  const settings = async () => {
    await fetch('/api/public/settings')
      .then(res => res.json())
      .then(x => x && setInfo(x))
  }

  useEffect(() => {
    settings()
  }, [])

  useEffect(() => {
    setLoading(true)
    getUserById()
    setLoading(false)
  }, [current_profile_id])

  useEffect(() => {
    if (!user || !user?.avatar) return
    setAvatar(`/assets/avatars/${user?.avatar}`)
  }, [user])

  if (user != 'null') {
    return (<>
      <Head>
        <title>{`profile - ${user?.username}`}</title>
      </Head>
      <PageLoading loading={loading} />
      <TempLoading loading={tempLoading} />
      <Transition appear show={reportIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={() => setReportIsOpen(false)}>
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
                    <button onClick={() => reportUser()} className="primary text-sm">Create</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {user?.isBanned && <div className="bg-gray-700 rounded-sm p-6 lg:w-[500px] sm:w-11/12 mx-auto mt-8">
        <h1 className="text-2xl pb-4 font-medium">{user?.username} is currently <span className="text-red-700 uppercase font-bold">banned</span></h1>
        <Link href='/'>
          <button className="btn-secondary">Home</button>
        </Link>
        <button className="success ml-2" onClick={unbanUser}>Unban</button>
      </div> || (!user?.isVerified && info?.memberVerification) && <div className="bg-gray-700 text-white rounded-sm p-6 lg:w-[500px] sm:w-11/12 mx-auto mt-8">
        <h1 className="text-2xl pb-4 font-medium">{session?.user?.rank?.admin && user?.username || 'Requested User'} is pending</h1>
        <Link href='/'>
          <button className="btn-secondary">Home</button>
        </Link>
        {session?.user?.rank?.admin && <>
          <button onClick={verifyUser} className="ml-2 rounded-sm py-1 px-3 transition duration-100 hover:bg-blue-500/80 bg-blue-500 text-white cursor-pointer font-medium">Verify</button>
          <button onClick={deleteUser} className="ml-2 rounded-sm py-1 px-3 transition duration-100 hover:bg-red-500/80 bg-red-500 text-white cursor-pointer font-medium">Delete</button>
        </>}
      </div> || !user?.active && <>
        <div className="mt-8 max-w-md mx-auto bg-gray-700 rounded-sm p-6">
          <div className="text-2xl font-bold">User not found.</div>
          <Link href='/'>
            <button className="mt-4 btn-secondary">Home</button>
          </Link>
        </div>
      </> ||
        <div className="mt-8 bg-gray-700 text-white rounded-sm p-6 flex items-start justify-between">
          <div className="flex items-start flex-col">
            <div className="flex items-center">
              <div className="w-28 h-28 mr-4 border-[3px] rounded-full" style={{ borderColor: user?.rank?.color }}>
                <Image loading='lazy' layout='responsive' objectFit='cover' className="rounded-full" src={avatar} width='100%' height='100%' />
              </div>
              <div className="inline-flex items-start flex-col">
                <div>{user?.online && <div className="w-[10px] inline-block aspect-square bg-green-500 rounded-full mr-1"></div>}<span style={{ color: user?.rank?.color }}>{user?.username}</span> (@{user?.name})</div>
                <div>{user?.rank?.name}</div>
              </div>
            </div>
            <div className="mt-4">
              <div>Posts: <span className="font-bold">{user?.posts?.length}</span></div>
              <div>Likes: <span className="font-bold">{user?.likes}</span></div>
              {user.bio != '' && <div>Bio: <span className="font-bold">{user?.bio}</span></div>}
            </div>
          </div>
          <div>
            <Link href='/profile/[id]/settings' as={`/profile/${current_profile_id}/settings`}>
              <button className="dark mr-2">
                <i className="fas fa-cog"></i>
              </button>
            </Link>
            <button className="dark mr-2">
              <i className="fas fa-message"></i>
            </button>
            {(session?.user?.id != user?.id) && <button onClick={() => setReportIsOpen(true)} className="dark">
              <i className="fas fa-circle-exclamation"></i>
            </button>}
            {(session?.user?.rank?.ban_users && session?.user?.id != user?.id) && <button onClick={banUser} className="danger ml-2"><i className="fas fa-hammer"></i></button>}
          </div>
        </div>}
    </>)
  } else {
    return (<>
      <HeadInfo title='profile' />
      <div className="bg-gray-700 rounded-sm p-6 lg:w-[500px] sm:w-11/12 mx-auto mt-8">
        <h1 className="text-2xl pb-4 font-medium">User with requested ID does not exist</h1>
        <Link href='/'>
          <button className="rounded-sm py-1 px-3 transition duration-100 hover:bg-white/90 bg-white text-black cursor-pointer font-medium">Home</button>
        </Link>
      </div>
    </>)
  }
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session) return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }
  return {
    props: {}
  }
}

export default Profile