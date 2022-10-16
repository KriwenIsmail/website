import { signIn } from "next-auth/react"
import { useState } from "react"
import TempLoading from "./TempLoading"

const Login = ({ credentials }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const signin = async () => {
    setLoading(true)
    await fetch(`/api/userAuthentication/login?email=${email}&password=${password}`)
      .then(res => res.json())
      .then(data => {
        if (data?.data == null) {
          setEmail('')
          setPassword('')
        } else signIn(credentials?.value, { email })
      })
    setLoading(false)
  }

  return (
    <>
      <TempLoading loading={loading} />
      <form onSubmit={e => e.preventDefault()} className="mt-2 flex flex-col items-start md:flex-row md:items-center pt-2">
        <input value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-200 dark:text-black dark:focus:text-white text-xs sm:text-base mb-2 md:mb-0 rounded py-0.5 px-1 border-2 focus:border-purple-500 focus:bg-transparent font-medium inline-block" type="email" placeholder="email" />
        <input value={password} onChange={e => setPassword(e.target.value)} className="bg-gray-200 dark:text-black dark:focus:text-white text-xs sm:text-base mb-2 md:mb-0 md:ml-2 rounded py-0.5 px-1 border-2 focus:border-purple-500 focus:bg-transparent font-medium inline-block" type="password" placeholder="password" />
        <button type="submit" onClick={signin} className="md:ml-2 text-xs md:text-sm bg-purple-700 hover:bg-purple-700/70">Login</button>
      </form>
    </>
  )
}

export default Login