import { useState } from "react"
import TempLoading from "../../../../components/TempLoading"

const Username = ({ user, router }) => {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const changeUsername = async () => {
    setLoading(true)
    if (username == user?.username) {
      setError('username can\'t be the previous one.')
      setTimeout(() => setError(''), 1500)
      return
    }
    if (username == '') {
      setError('username can\'t be the empty.')
      setTimeout(() => setError(''), 1500)
      return
    }
    if (username != user?.username && username != '') {
      await fetch(`/api/membersApi/settings/changeUsername?id=${user?.id}&name=${username}`)
        .then(res => res.json())
        .then(data => {
          if (!data?.success) {
            setError('something went wrong')
            setUsername(user?.username)
          } else {
            setSuccess(`Successfully changed username from ${user?.username} to ${username}`)
            setTimeout(() => {
              setSuccess('')
              setTimeout(() => router.reload(), 0)
            }, 1500)
          }
        })
    }
    setLoading(false)
  }

  return (
    <>
      <TempLoading loading={loading} />
      <div>
        <label className="block font-medium" htmlFor="username">Username</label>
        <input className="bg-gray-200 dark:focus:text-white rounded py-1 px-2 border-2 focus:border-purple-500 focus:bg-transparent font-medium inline-block text-black" value={username} type="text" id="username" name="username" onChange={e => setUsername(e.target.value)} />
        {(username != '' && username != user?.username) && <button onClick={changeUsername} className="rounded-sm cursor-pointer text-white py-1 px-3 ml-2 transition duration-100 hover:bg-green-500/70 bg-green-500">Save</button>}
        {error != '' && <div className="text-red-500 italic text-sm block font-bold">{error}</div>}
        {success != '' && <div className="text-green-500 text-sm block font-bold">{success}</div>}
      </div>
    </>
  )
}

export default Username