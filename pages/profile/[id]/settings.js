import Link from "next/link"
import { useSession, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import HeadInfo from "../../../components/Head"
import Head from "next/head"
import { useEffect, useState } from "react"
import PageLoading from "../../../components/PageLoading"
import Username from "./components/username"
import Password from "./components/password"
import Bio from "./components/bio"
import Ranking from "./components/ranking"
import UpdateAvatar from "./components/avatar"
import DeleteUser from "./components/deleteUser"

const Settings = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const current_profile_id = router.query?.id
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verification, setVerification] = useState(false)
  const getUserById = async () => {
    await fetch(`/api/membersApi/getUserById?user_id=${current_profile_id}`)
      .then(res => res.json())
      .then(data => data?.data && setUser(data?.data))
  }

  const getSettings = async () => {
    await fetch('/api/public/settings')
      .then(x => x.json())
      .then(x => setVerification(x?.data?.memberVerification))
  }

  useEffect(() => {
    getSettings()
  }, [])

  useEffect(() => {
    if (user != null && (user?.isBanned || (!user?.isVerified && verification))) router.push('/')
  }, [user, verification])

  useEffect(() => {
    setLoading(true)
    getUserById()
    setLoading(false)
  }, [current_profile_id])

  if (user != 'null') {
    return (<>
      <Head>
        <title>{`profile - ${user?.username}`}</title>
      </Head>
      <PageLoading loading={loading} />
      <div className="mt-8 bg-gray-700 rounded-sm p-6">
        <Username user={user} router={router} />
        {user?.id == session?.user?.id && <Password user={user} router={router} />}
        <Bio user={user} router={router} />
        {(session?.user?.rank?.admin && session?.user?.id != current_profile_id && user?.rank?.id != 1) && <Ranking user={user} router={router} />}
        {(session?.user?.rank?.delete_users || session?.user?.id == user?.id) && <DeleteUser user={user} router={router} session={session} />}
        {session?.user?.id == user?.id && <UpdateAvatar user={user} router={router} />}
      </div>
    </>)
  } else {
    return (<>
      <HeadInfo title='profile' />
      <div className="bg-gray-300 rounded-sm p-6 lg:w-[500px] sm:w-11/12 mx-auto mt-10">
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

export default Settings