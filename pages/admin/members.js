import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import TempLoading from "../../components/TempLoading"
import pushLog from "../../utils/pushLog"

const Members = () => {
  const { data: session } = useSession()
  const [section, setSection] = useState('pending')
  const [membersList, setMembersList] = useState([])
  const [loading, setLoading] = useState(false)
  const getMembers = async () => {
    await fetch('/api/membersApi/getAllUsers')
      .then(res => res.json())
      .then(data => data?.data && setMembersList(data?.data))
  }

  const verifyUser = async (id) => {
    setLoading(true)
    await fetch(`/api/moderateUser/verifyUserById?user_id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          getMembers()
          const target = membersList.filter(e => e?.id == id)
          pushLog(`${session?.user?.username} verified ${target[0]?.username}`)
        }
      })
    setLoading(false)
  }

  const deleteUser = async (id) => {
    setLoading(true)
    await fetch(`/api/moderateUser/deleteUserId?user_id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          getMembers()
          const target = membersList.filter(e => e?.id == id)
          pushLog(`${session?.user?.username} deleted ${target[0]?.username}`)
        }
      })
    setLoading(false)
  }

  const banUser = async (id) => {
    setLoading(true)
    await fetch(`/api/moderateUser/ban?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          getMembers()
          const target = membersList.filter(e => e?.id == id)
          pushLog(`${session?.user?.username} banned ${target[0]?.username}`)
        }
      })
    setLoading(false)
  }

  const unbanUser = async (id) => {
    setLoading(true)
    await fetch(`/api/moderateUser/unban?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          getMembers()
          const target = membersList.filter(e => e?.id == id)
          pushLog(`${session?.user?.username} unbanned ${target[0]?.username}`)
        }
      })
    setLoading(false)
  }

  const restoreUser = async (id) => {
    setLoading(true)
    await fetch(`/api/moderateUser/restore?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          getMembers()
          const target = membersList.filter(e => e?.id == id)
          pushLog(`${session?.user?.username} restored ${target[0]?.username}`)
        }
      })
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getMembers()
    setLoading(false)
  }, [])

  return (
    <>
      <TempLoading loading={loading} />
      <div className="grid grid-cols-4 mt-4 dark:text-white">
        <div className="col-span-1">
          {session?.user?.rank?.verify_users && <div className={`w-fit mx-auto font-medium text-lg mb-2 hover:font-bold cursor-pointer ${section == 'pending' && 'font-bold'}`} onClick={() => setSection('pending')}>Pending</div>}
          {session?.user?.rank?.delete_users && <div className={`w-fit mx-auto font-medium text-lg mb-2 hover:font-bold cursor-pointer ${section == 'delete' && 'font-bold'}`} onClick={() => setSection('delete')}>Delete</div>}
          {session?.user?.rank?.ban_users && <div className={`w-fit mx-auto font-medium text-lg mb-2 hover:font-bold cursor-pointer ${section == 'ban' && 'font-bold'}`} onClick={() => setSection('ban')}>Ban/Unban</div>}
          {session?.user?.rank?.restore_users && <div className={`w-fit mx-auto font-medium text-lg mb-2 hover:font-bold cursor-pointer ${section == 'restore' && 'font-bold'}`} onClick={() => setSection('restore')}>Restore</div>}
        </div>
        <div className="col-span-3 max-h-64 overflow-y-auto">
          {section == 'pending' && (
            membersList.filter(e => e?.isVerified == false).length > 0 && (membersList.filter(e => e.isVerified == false).map(_ => <div key={_?.id} className="mb-2 last:mb-0 px-2 flex items-center justify-between">
              <span>{_?.name}</span>
              <button onClick={() => verifyUser(_?.id)} className="primary">Verify</button>
            </div>)) || <div className="text-center font-medium text-lg">No Pending Users.</div>
          ) || section == 'delete' && (
            membersList.filter(e => e?.rank?.delete_users == false && e?.active).map(_ => <div key={_?.id} className="mb-2 last:mb-0 px-2 flex items-center justify-between">
              <span>{_?.name}</span>
              <button onClick={() => deleteUser(_?.id)} className="danger">Delete</button>
            </div>)
          ) || section == 'ban' && (
            membersList.filter(e => e?.rank?.ban_users == false && e?.active == true).map(_ => <div key={_?.id} className="mb-2 last:mb-0 px-2 flex items-center justify-between">
              <span>{_?.name}</span>
              {_?.isBanned == false && <button onClick={() => banUser(_?.id)} className="danger">Ban</button>}
              {_?.isBanned && <button onClick={() => unbanUser(_?.id)} className="ml-2 success">Unban</button>}
            </div>)
          ) || section == 'restore' && (
            membersList.filter(e => e?.rank?.restore_users == false && e?.active == false).map(_ => <div key={_?.id} className="mb-2 last:mb-0 px-2 flex items-center justify-between">
              <span>{_?.name}</span>
              <button onClick={() => restoreUser(_?.id)} className="primary">Restore</button>
            </div>)
          )}
        </div>
      </div>
    </>
  )
}

export default Members