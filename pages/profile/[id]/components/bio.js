import { useState } from "react"
import TempLoading from "../../../../components/TempLoading"

const Bio = ({ user, router }) => {
  const [loading, setLoading] = useState(false)
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const changeBio = async () => {
    setLoading(true)
    if (bio == user?.bio) {
      setError('bio can\'t be the previous one.')
      setTimeout(() => setError(''), 1500)
      return
    }
    if (bio == '') {
      setError('bio can\'t be the empty.')
      setTimeout(() => setError(''), 1500)
      return
    }
    if (bio != user?.bio && bio != '') {
      await fetch(`/api/membersApi/settings/changeBio?id=${user?.id}&bio=${bio}`)
        .then(res => res.json())
        .then(data => {
          if (!data?.success) {
            setError('something went wrong')
            setBio(user?.bio)
          } else {
            setSuccess(`Successfully changed your bio.`)
            setTimeout(() => {
              setSuccess('')
              setTimeout(() => router.reload(), 0)
            }, 1000)
          }
        })
    }
    setLoading(false)
  }

  return (
    <>
      <TempLoading loading={loading} />
      <div className="mt-2">
        <label className="block font-medium" htmlFor="bio">Bio</label>
        <input className="bg-gray-200 dark:focus:text-white rounded py-1 px-2 border-2 focus:border-purple-500 focus:bg-transparent font-medium inline-block text-black" value={bio} type="text" id="bio" name="bio" onChange={e => setBio(e.target.value)} />
        {(bio != '' && bio != user?.bio) && <button onClick={changeBio} className="rounded-sm cursor-pointer text-white py-1 px-3 ml-2 transition duration-100 hover:bg-green-500/70 bg-green-500">Save</button>}
        {error != '' && <div className="text-red-500 italic text-sm block font-bold">{error}</div>}
        {success != '' && <div className="text-green-500 text-sm block font-bold">{success}</div>}
      </div>
    </>
  )
}

export default Bio