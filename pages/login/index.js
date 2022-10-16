import { useRouter } from "next/router"
import { getProviders, getSession } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import LoginPage from "./components/login"
import RegisterPage from "./components/register"

const Login = ({ providers }) => {
  const router = useRouter()
  const credentialsRef = useRef(null)
  const [page, setPage] = useState('login')
  const current_page = router.query?.page

  useEffect(() => {
    if (!current_page) return
    setPage(current_page)
  }, [current_page])

  return (<>
    <input type="hidden" ref={credentialsRef} name="credentialsID" value={providers.credentials.id} />
    {page == 'login' && <LoginPage credentials={credentialsRef.current} setPage={setPage} /> || <RegisterPage credentials={credentialsRef.current} setPage={setPage} />}
  </>)
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {
      providers: await getProviders(context)
    }
  }
}

export default Login