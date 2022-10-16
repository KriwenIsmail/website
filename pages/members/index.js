import Link from "next/link"
import { getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import HeadInfo from "../../components/Head"
import PageLoading from "../../components/PageLoading"
import TempLoading from "../../components/TempLoading"
import formatDate from "../../utils/formatDate"
import Select from "../../components/Select"

const usersPerPage = 10
const Members = () => {
  const [filterBy, setFilterBy] = useState('all')
  const [members, setMembers] = useState([])
  const [membersList, setMembersList] = useState([])
  const [ranksList, setRanksList] = useState([])
  const [rankFilterBy, setRankFilterBy] = useState('owner')
  const [pageLoading, setPageLoading] = useState(true)
  const [tempLoading, setTempLoading] = useState(false)
  const [index, setIndex] = useState(1)
  const [pagesCount, setPagesCount] = useState([])
  const getAllUsers = async () => {
    await fetch('/api/membersApi/getAllUsers')
      .then(res => res.json())
      .then(data => {
        const membersArray = []
        data?.data.map(_ => (!membersArray.includes(_) && _?.active != false) && membersArray.push(_))
        setMembers(membersArray)
      })
  }

  const getUserByRank = async () => {
    const rankId = ranksList.filter(e => e?.name == rankFilterBy)[0]?.id || 1
    await fetch(`/api/membersApi/getUserByRank?rank=${rankId}`)
      .then(res => res.json())
      .then(data => {
        const membersArray = []
        data?.data.map(_ => (!membersArray.includes(_) && _?.active != false) && membersArray.push(_))
        setMembers(membersArray)
      })
  }

  const getAllRanks = async () => {
    await fetch('/api/membersApi/getRanks')
      .then(res => res.json())
      .then(data => setRanksList(data?.data))
  }

  const init = () => {
    const list = []
    for (let i = ((usersPerPage * index) - usersPerPage); i < (usersPerPage * index); i++) members[i] && list.push(members[i])
    setMembersList(list)
  }

  const defaultList = () => {
    if (members.length == 0 || members.length <= usersPerPage) return setMembersList(members)
    setPagesCount([])
    for (let i = 1; i <= Math.floor(members.length / usersPerPage); i++) setPagesCount(list => [...list, i])
    init()
    if ((members.length / usersPerPage % 2 != 0) && (members.length - (members.length - Math.floor(members.length / usersPerPage)) < usersPerPage) && (members.length - (members.length - Math.floor(members.length / usersPerPage)) > 0)) setPagesCount(list => [...list, pagesCount.length])
  }

  useEffect(() => {
    setPageLoading(true)
    if (filterBy == 'all') getAllUsers()
    else if (filterBy == 'by group / rank') {
      getAllRanks()
      getUserByRank()
    }
    setIndex(1)
    setPageLoading(false)
  }, [filterBy, rankFilterBy])

  useEffect(() => {
    defaultList()
  }, [members])

  useEffect(() => {
    init()
  }, [index])

  return <>
    <PageLoading loading={pageLoading} />
    <TempLoading loading={tempLoading} />
    <HeadInfo title='members' />
    <div className="mt-4">
      <Select selected={filterBy} setSelected={setFilterBy} options={['all', 'by group / rank']} position={'bottom'} customClasses={'z-[99]'} />
      {filterBy === 'by group / rank' && <>
        <Select selected={rankFilterBy} setSelected={setRankFilterBy} options={ranksList.map(_ => _?.name)} position='bottom' customClasses={'z-[98]'} />
      </>}
      <div className="bg-black rounded-t-sm grid-cols-12 border-b-2 border-b-gray-500 text-white grid">
        <div className="col-span-3 text-center border-r-2 px-1 py-2 border-r-gray-500">name</div>
        <div className="col-span-3 text-center border-r-2 px-1 py-2 border-r-gray-500">username</div>
        <div className="col-span-2 text-center border-r-2 px-1 py-2 border-r-gray-500">group / rank</div>
        <div className="col-span-1 text-center border-r-2 px-1 py-2 border-r-gray-500">posts</div>
        <div className="col-span-3 text-center border-r-2 border-r-transparent px-1 py-2">date registered</div>
      </div>
      <div className="bg-black rounded-b-sm text-white">
        {membersList.length > 0 && membersList.map(member => <div key={member?.id} className="grid grid-cols-12">
          <Link href='/profile/[id]' as={`/profile/${member?.id}`}>
            <div className="col-span-3 text-center border-r-gray-500 border-r-2 px-1 py-2">
              <span className="hover:underline cursor-pointer" style={{ color: member?.rank?.color }}>{member?.username}</span>
              <span className={`pl-2 text-sm italic text-white`}>({member?.online ? 'Online' : 'Offline'})</span>
            </div>
          </Link>
          <div className="col-span-3 text-center border-r-2 px-1 py-2 border-r-gray-500">{member?.name}</div>
          <div className="col-span-2 text-center border-r-2 px-1 py-2 border-r-gray-500">{member?.rank?.name}</div>
          <div className="col-span-1 text-center border-r-2 px-1 py-2 border-r-gray-500">{member?.posts?.length}</div>
          <div className="col-span-3 text-center border-r-2 border-r-transparent px-1 py-2">
            {member && `${formatDate(member?.createdAt).MONTH} ${formatDate(member?.createdAt).DAY}, ${formatDate(member?.createdAt).YEAR} at ${formatDate(member?.createdAt).HOURS}:${formatDate(member?.createdAt).MINUTES}`}
          </div>
        </div>
        ) || <div className="text-center px-1 py-2 font-medium">no users found</div>}
      </div>
      <div className="mt-4 flex items-center justify-center">
        {pagesCount.map((_, i) => <button onClick={() => setIndex(_)} className={`bg-purple-500 ml-2 first:ml-0 ${index == _ ? 'bg-purple-900' : 'hover:bg-purple-500/70'}`} key={i * Math.random() * 1000}>{_}</button>)}
      </div>
    </div>
  </>
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

export default Members