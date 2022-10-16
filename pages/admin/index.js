import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import PageLoading from "../../components/PageLoading"
import Categories from "./categories"
import Settings from "./settings"
import Members from "./members"
import Logs from "./logs"
import Reports from "./reports"
import Head from "next/head"
import Roles from "./roles"

const Admin = ({ session }) => {
  const user = session?.user
  const [section, setSection] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      <Head>
        <title>admin panel</title>
      </Head>
      <PageLoading loading={loading} />
      <div className="flex items-center justify-center mt-2 rounded-sm max-w-full overflow-x-auto p-1">
        {user?.rank?.manage_settings && <button onClick={() => setSection('settings')} className={`mr-4 bg-purple-700 ${section == 'settings' && 'bg-purple-800' || 'hover:bg-purple-700/70'}`}>Settings</button>}
        {user?.rank?.manage_categories && <button onClick={() => setSection('categories')} className={`mr-4 bg-purple-700 ${section == 'categories' && 'bg-purple-800' || 'hover:bg-purple-700/70'}`}>categories</button>}
        {(user?.rank?.ban_users || user?.rank?.verify_users || user?.rank?.restore_users || user?.rank?.delete_users) && <button onClick={() => setSection('members')} className={`mr-4 bg-purple-700 ${section == 'members' && 'bg-purple-800' || 'hover:bg-purple-700/70'}`}>members</button>}
        {user?.rank?.manage_roles && <button onClick={() => setSection('roles')} className={`mr-4 bg-purple-700 ${section == 'roles' && 'bg-purple-800' || 'hover:bg-purple-700/70'}`}>roles</button>}
        <button onClick={() => setSection('reports')} className={`mr-4 bg-purple-700 ${section == 'reports' && 'bg-purple-800' || 'hover:bg-purple-700/70'}`}>reports</button>
        <button onClick={() => setSection('logs')} className={`bg-purple-700 ${section == 'logs' && 'bg-purple-800' || 'hover:bg-purple-700/70'}`}>logs</button>
      </div>
      <div className="mt-2 pt-2 border-t-2 border-t-purple-700 px-4">
        {section == 'categories' && <Categories /> || section == 'settings' && <Settings /> || section == 'members' && <Members /> || section == 'logs' && <Logs /> || section == 'roles' && <Roles /> || section == 'reports' && <Reports />}
      </div>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  if (session) {
    if (session?.user?.rank?.access_dashboard) return {
      props: { session }
    }
    return {
      redirect: {
        destination: '/',
        permanenet: false
      }
    }
  }
  return {
    redirect: {
      destination: '/login',
      permanenet: false
    }
  }
}

export default Admin