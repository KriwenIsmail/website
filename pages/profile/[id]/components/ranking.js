import Select from "../../../../components/Select"
import { useEffect, useState } from "react"

const orderData = (list, orderBy) => {
  const arr = []
  list.map(_ => arr[_[orderBy] - 1] = _?.name)
  return arr
}

const Ranking = ({ user, router }) => {
  const [selectedRank, setSelectedRank] = useState(user?.rank?.name)
  const [ranks, setRanks] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const getRanks = async () => {
    await fetch(`/api/membersApi/getRanks`)
      .then(res => res.json())
      .then(data => data?.data && setRanks(orderData(data?.data, 'order')))
  }

  const rankUser = async () => {
    await fetch(`/api/moderateUser/rankUser?user_id=${user?.id}&rank=${selectedRank}`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          setSuccess(`Successfully changed ${user?.username}'s rank to ${selectedRank}`)
          setTimeout(() => {
            setSuccess('')
            setTimeout(() => router.reload(), 0)
          }, 1500)
        } else {
          setError(`Something went wrong`)
          setTimeout(() => setError(''), 1500)
        }
      })
  }

  useEffect(() => {
    getRanks()
  }, [])

  useEffect(() => {
    if (user == null) return
    setSelectedRank(user?.rank?.name)
  }, [user])

  return (
    <>
      <div className="mt-4">
        <Select selected={selectedRank} setSelected={setSelectedRank} options={ranks} customClasses={'inline-block z-10 -mb-4'} />
        {selectedRank != user?.rank?.name && <button onClick={rankUser} className="success ml-2">Save</button>}
        {error != '' && <div className="text-red-500 italic text-sm block font-bold">{error}</div>}
        {success != '' && <div className="text-green-500 text-sm block font-bold">{success}</div>}
      </div>
    </>
  )
}

export default Ranking