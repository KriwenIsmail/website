import { signIn } from "next-auth/react"
import { useRef, useState } from "react"
import HeadInfo from "../../../components/Head"
import TempLoading from "../../../components/TempLoading"

const LoginPage = ({ credentials, setPage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const pwdRef = useRef(null)
  const iconRef = useRef(null)
  const [errors, setErrors] = useState([])
  const togglePwd = () => {
    const input = pwdRef.current
    const icon = iconRef.current
    if (input != null && icon != null) {
      if (input.getAttribute('type') == 'password') {
        input.setAttribute('type', 'text')
        icon?.classList.replace('fa-eye-slash', 'fa-eye')
      } else {
        input.setAttribute('type', 'password')
        icon?.classList.replace('fa-eye', 'fa-eye-slash')
      }
    }
  }

  const signin = async () => {
    setLoading(true)
    await fetch(`/api/userAuthentication/login?email=${email}&password=${pwdRef.current?.value}`)
      .then(res => res.json())
      .then(async (data) => {
        if (data?.data == undefined && data?.data != null) setErrors(['Something went wrong'])
        else {
          if (data?.data == null) {
            setErrors(['Requested user was not found'])
            setEmail('')
            setPassword('')
          } else if (data?.message != undefined) {
            setErrors(['Incorrect Password'])
            setPassword('')
          } else if (data?.data != null) {
            await fetch(`/api/public/settings`)
              .then(response => response.json())
              .then(settings => {
                if (settings?.data) {
                  if (settings?.data?.memberVerification && !data?.data?.isVerified) {
                    setErrors(['Your account is still pending'])
                    setEmail('')
                    setPassword('')
                  } else signIn(credentials?.value, { email })
                } else setEmail(['Something went wrong'])
              })
          }
        }
      })
    setLoading(false)
  }

  return (
    <>
      <TempLoading loading={loading} />
      <HeadInfo title='login' />
      {errors.length > 0 && <div className="lg:w-[650px] md:w-[300px] mx-auto mt-6 mb-2 bg-rose-500 border-2 border-red-700 rounded-sm py-2 px-3 text-red-900 font-bold">
        {errors.map((error, index) => <div key={index}>{error}</div>)}
        <div className="flex justify-end">
          <button className="text-right bg-red-700 text-white px-3 py-1 rounded-sm" onClick={() => setErrors([])}>
            Clear
          </button>
        </div>
      </div>}
      <form onSubmit={e => e.preventDefault()} className="p-4 mt-6 grid place-content-center rounded-sm bg-neutral-900 text-white m-auto w-[650px] shadow-lg">
        <div className="text-center text-xl font-bold pb-2">
          <span className="cursor-pointer">Sign in</span>
          <span> | </span>
          <span className="text-zinc-400 cursor-pointer" onClick={() => setPage('')}>Sign up</span>
        </div>
        <div className="py-2 px-4">
          <label htmlFor="email" className="block pb-1">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="rounded-sm w-80 m-auto text-black py-[3px] px-[5px] border-2" type="email" name="email" id="email" required={true} />
        </div>
        <div className="py-2 px-4">
          <label htmlFor="pwd" className="block pb-1">Password</label>
          <input ref={pwdRef} value={password} onChange={e => setPassword(e.target.value)} className="rounded-sm w-80 text-black py-[3px] px-[5px] border-2" type="password" name="pwd" id="pwd" required={true} />
        </div>
        <div className="py-2 px-4 mt-2 flex justify-center items-center">
          <button type="submit" onClick={signin} role="button" className="mr-2 bg-blue-600 px-3 py-1 rounded-sm">Login</button>
          <button type="button" onClick={togglePwd} role="button" className="bg-neutral-600 px-3 py-1 rounded-sm">
            <i ref={iconRef} className="fas fa-eye-slash"></i>
          </button>
        </div>
      </form>
    </>
  )
}

export default LoginPage