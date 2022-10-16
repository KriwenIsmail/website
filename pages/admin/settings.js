import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import TempLoading from "../../components/TempLoading"
import pushLog from "../../utils/pushLog"

const Settings = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [siteInfo, setSiteInfo] = useState({})
  const [title, setTitle] = useState('')
  const [slogan, setSlogan] = useState('')
  const [memberVerification, setMemberVerification] = useState(false)
  const getSettings = async () => {
    await fetch(`/api/public/settings`)
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setSiteInfo(data?.data)
          setTitle(data?.data?.title)
          setSlogan(data?.data?.slogan)
          setMemberVerification(data?.data?.memberVerification)
        }
      })
  }

  const updateAll = async () => {
    setLoading(true)
    if (title != siteInfo?.title) {
      await fetch(`/api/moderateSettings/updateTitle?title=${title}`)
        .then(res => res.json())
        .then(() => {
          pushLog(`${session?.user?.username} changed the website title to ${title}`)
          setTimeout(() => router.reload(), 0)
        })
    }
    if (slogan != siteInfo?.slogan) {
      await fetch(`/api/moderateSettings/updateSlogan?slogan=${slogan}`)
        .then(res => res.json())
        .then(() => {
          pushLog(`${session?.user?.username} changed the website slogan to ${slogan}`)
          setTimeout(() => router.reload(), 0)
        })
    }
    if (memberVerification != siteInfo?.memberVerification) {
      await fetch(`/api/moderateSettings/updateMemberVerification?value=${memberVerification}`)
        .then(res => res.json())
        .then(() => {
          pushLog(`${session?.user?.username} ${memberVerification ? 'enabled' : 'disabled'}  member verification`)
          setTimeout(() => router.reload(), 0)
        })
    }
  }

  useEffect(() => {
    setLoading(true)
    getSettings()
    setLoading(false)
  }, [])

  return (
    <>
      <TempLoading loading={loading} />
      <div>
        <label className="block text-xl pb-2 dark:text-white" htmlFor="title">Title</label>
        <input className="bg-gray-200 rounded py-1 px-2 border-2 focus:border-purple-500 focus:bg-transparent font-medium inline-block dark:text-black dark:focus:text-white" type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="mt-4">
        <label className="block text-xl pb-2 dark:text-white" htmlFor="slogan">Slogan</label>
        <input className="bg-gray-200 rounded py-1 px-2 border-2 focus:border-purple-500 focus:bg-transparent font-medium inline-block dark:text-black dark:focus:text-white" type="text" name="slogan" id="slogan" value={slogan} onChange={e => setSlogan(e.target.value)} />
      </div>
      <div className="mt-4 flex items-start justify-center flex-col">
        <div className="text-xl pb-2 dark:text-white">Member Verification</div>
        <div onClick={() => setMemberVerification(prev => !prev)} className={`${memberVerification ? 'bg-blue-500' : 'bg-gray-200'} relative inline-block h-[20px] w-[50px] cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}>
          <span className="sr-only">Use setting</span>
          <span aria-hidden="true" className={`${memberVerification ? 'left-[57%]' : 'left-[5%]'} pointer-events-none inline-block h-[90%] aspect-square absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-200 ease-in-out`} />
        </div>
      </div>
      {(title != siteInfo?.title || memberVerification != siteInfo?.memberVerification || slogan != siteInfo?.slogan) && <div className="flex items-center justify-end mt-4">
        <button onClick={updateAll} className="bg-purple-700 hover:bg-purple-700/70">Save</button>
      </div>}
    </>
  )
}

export default Settings