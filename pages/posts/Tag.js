import { useEffect, useState } from "react"
import Image from "next/image"

const Tag = ({ tags }) => {
  const [tag, setTag] = useState('')
  const [users, setUsers] = useState([])
  const [matchingUsers, setMatchingUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const getUsers = async () => {
    await fetch(`/api/membersApi/getAllUsers`)
      .then(res => res.json())
      .then(data => data?.data && setUsers(data?.data))
  }

  const filter = () => {
    if (tag == '') return
    const results = users.filter(e => e?.name.includes(tag) || e?.username.includes(tag))
    setMatchingUsers(results)
  }

  useEffect(() => {
    setLoading(true)
    getUsers()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (users.length == 0) return
    filter()
  }, [users])

  useEffect(() => {
    setLoading(true)
    setMatchingUsers([])
    filter()
    setLoading(false)
  }, [tag])

  return (
    <div className="relative">
      <label htmlFor="tag" className="block pb-1">Tag:</label>
      <input id="tag" className="w-[75%] ml-2 border-2 rounded mb-2 px-3 py-1 transition duration-100 border-gray-300/80 focus:border-blue-500" type="text" value={tag} onChange={e => setTag(e.target.value)} />
      <div className="bg-white rounded-sm shadow-md w-[75%] ml-2 max-h-28 overflow-y-auto">
        {loading && <div className="absolute left-1/2 top-8 temp-spin aspect-square w-8 border-4 border-gray-50/50 z-10 border-t-blue-500 rounded-full"></div>}
        <div className={`${loading && 'bg-black/50 opacity-50'}`}>
          {matchingUsers.length > 0 && matchingUsers.map(_ => (
            <div key={_?.id} className="hover:bg-gray-300/70 cursor-pointer px-3 py-1 flex items-start justify-start">
              <div className="w-12 aspect-square mr-3 border-2 rounded-full" style={{ borderColor: _?.rank?.color }}>
                <Image loading='lazy' layout='responsive' objectFit='cover' className="rounded-full" src={`/assets/avatars/${_?.avatar}`} width='100%' height='100%' />
              </div>
              <div className="pt-1.5">
                <span style={{ color: _?.rank?.color }}>{_?.username}</span> <span className="text-sm">(@{_?.name})</span>
              </div>
            </div>
          )) || <div className="text-center px-3 py-1">No matching users.</div>}
        </div>
      </div>
    </div>
  )
}

export default Tag