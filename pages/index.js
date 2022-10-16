import Link from "next/link"
import { getProviders, useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import HeadInfo from "../components/Head"
import PageLoading from "../components/PageLoading"
import formatDate from "../utils/formatDate"
import Login from "../components/CustomLogin"

const orderData = (list, orderBy) => {
  const arr = []
  list.map(_ => arr[_[orderBy] - 1] = _)
  return arr
}

const Category = ({ data }) => {
  return (
    <>
      <div className={`col-span-1 p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-50 border-l-4 flex justify-between flex-col`} style={{ borderLeftColor: data?.theme }}>
        <div>
          {data?.password != '' && <i className="fas fa-lock pr-2"></i>}
          <Link href='/category/[id]' as={`/category/${data?.id}`}>
            <span className="cursor-pointer font-bold text-2xl hover:underline" style={{ color: data?.theme }}>{data?.name}</span>
          </Link>
          <div className="font-light text-lg py-1">{data?.description}</div>
        </div>
        <div className="flex items-center justify-between flex-col sm:flex-row">
          <div>
            <i className="fas fa-comment-dots"></i>
            <span className="pl-2">{data?.topics?.length}</span>
          </div>
          <div className="sm:mt-2">
            <i className="fas fa-clock"></i>
            <span className="pl-2">
              {`${formatDate(data?.createdAt).MONTH} ${formatDate(data?.createdAt).DAY}, ${formatDate(data?.createdAt).YEAR} at ${formatDate(data?.createdAt).HOURS}:${formatDate(data?.createdAt).MINUTES}`}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

const Home = ({ providers }) => {
  const { data: session } = useSession()
  const credentialsRef = useRef(null)
  const [pageLoading, setPageLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [ranks, setRanks] = useState([])
  const [statistics, setStatistics] = useState({})
  const [onlineUsers, setOnlineUsers] = useState([])

  const getCategories = async () => {
    await fetch(`/api/categories/getCategories`)
      .then(res => res.json())
      .then(data => data?.data && setCategories(orderData(data?.data, 'order')))
  }

  const getRanks = async () => {
    await fetch(`/api/membersApi/getRanks`)
      .then(res => res.json())
      .then(data => data?.data && setRanks(orderData(data?.data, 'order')))
  }

  const getStatistics = async () => {
    await fetch(`/api/public/getLatest`)
      .then(res => res.json())
      .then(data => data && setStatistics(data))
  }

  const getOnlineUsers = async () => {
    await fetch('/api/public/getOnlineUsers')
      .then(res => res.json())
      .then(data => data?.data && setOnlineUsers(data?.data))
  }

  useEffect(() => {
    setPageLoading(true)
    getCategories()
    getRanks()
    getStatistics()
    getOnlineUsers()
    setPageLoading(false)
  }, [])

  return <>
    <HeadInfo title='home' />
    <PageLoading loading={pageLoading} />
    <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden">
      {categories.map(_ => _?.isVisible && (
        ((!session || !session?.user) && _?.allowGuests) && <Category key={_?.id} data={_} />
        || ((session && session?.user) && (JSON.parse(_?.allowedGroups).length == 0 || JSON.parse(_?.allowedGroups).includes(session?.user?.rank?.name)) && <Category key={_?.id} data={_} />)
      ) || (session && session?.user && session?.user?.rank?.admin) && <Category key={_?.id} data={_} />)}
    </div>
    <div className={`mt-4`}>
      <div className="bg-neutral-900 dark:bg-gray-800 dark:text-white py-2 px-4 rounded-t text-white">{'Website Information & Statistics'}</div>
      <div className="rounded-b p-4 border-2 border-t-0 border-neutral-900 dark:border-gray-800 dark:text-white">
        {!session?.user && <>
          <input type="hidden" ref={credentialsRef} name="credentialsID" value={providers.credentials.id} />
          <div className="border-b-2 pb-1 border-b-gray-300 text-blue-500 cursor-default"><Link href='/login'>Login</Link> • <Link href='/login?page=signup'>Register</Link></div>
          <Login credentials={credentialsRef.current} /></>}
        <div className={`${!session?.user && 'mt-4'} border-b-2 pb-1 border-b-gray-300 text-blue-500 cursor-default`}>Online users</div>
        <div className="italic pt-2">
          <div>
            <span>Online: </span>
            {onlineUsers.length > 0 && onlineUsers.map(_ => (
              <Link key={_?.id} href='/profile/[id]' as={`/profile/${_.id}`}>
                <span><span className="cursor-pointer hover:underline" style={{ color: _?.rank?.color }}>{_?.username}</span>{onlineUsers.indexOf(_) + 1 != onlineUsers.length && ', '} </span>
              </Link>
            )) || <span className="text-sm">No users online.</span>}
          </div>
          <span>Legends: </span>
          {ranks.map((_, i) => (
            <span key={_?.id} style={{ color: _?.color }}>{_?.name}{i + 1 != ranks.length && ', '} </span>
          ))}
        </div>
        <div className="mt-4 border-b-2 pb-1 border-b-gray-300 text-blue-500 cursor-default">Statistics</div>
        <div className="pt-2">
          Total Categories <span className="font-bold">{statistics?.categories}</span> •
          Total Posts <span className="font-bold">{statistics?.posts}</span> •
          Total Topics <span className="font-bold">{statistics?.topics}</span> •
          Total Members <span className="font-bold">{statistics?.members}</span> •
          Latest Member <Link href='/profile/[id]' as={`/profile/${statistics.latest_user?.id}`}><span className="font-bold cursor-pointer hover:underline" style={{ color: statistics.latest_user?.rank?.color }}>{statistics?.latest_user?.username}</span></Link>.
        </div>
      </div>
    </div>
  </>
}

export async function getServerSideProps(context) {
  return {
    props: {
      providers: await getProviders(context)
    }
  }
}

export default Home