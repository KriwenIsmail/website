import { signIn } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import HeadInfo from "../../../components/Head"
import TempLoading from "../../../components/TempLoading"

const RegisterPage = ({ credentials, setPage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isValid, setIsValid] = useState(false)
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

  useEffect(() => {
    if (email != '') setIsValid(/^([\.\_a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA-Z]){2,8}$/.test(email?.toString()?.toLowerCase()))
  }, [email])

  const signup = async () => {
    setLoading(true)
    if (email == '') !errors.includes('Email can\'t be empty') && setErrors(ERRORS => [...ERRORS, 'Email can\'t be empty'])
    if (name == '') !errors.includes('Username can\'t be empty') && setErrors(ERRORS => [...ERRORS, 'Username can\'t be empty'])
    if (password) !errors.includes('Password can\'t be empty') && setErrors(ERRORS => [...ERRORS, 'Password can\'t be empty'])
    if (email != '' && name != '' && password != '') {
      await fetch(`/api/userAuthentication/register?name=${name}&email=${email}&password=${password}`)
        .then(res => res.json())
        .then(async (data) => {
          if (data?.user_found) setErrors([<span>User Already Exists. <span className="cursor-pointer font-extrabold" onClick={() => setPage('login')}>Login</span>?</span>])
          else {
            await fetch(`/api/public/settings`)
              .then(response => response.json())
              .then(settings => {
                if (settings?.data) {
                  if (settings?.data?.memberVerification) {
                    setErrors(['Your account is pending.'])
                    setEmail('')
                    setPassword('')
                  } else signIn(credentials?.value, { email })
                } else setErrors(['Something went wrong'])
              })
          }
        })
    }
    setLoading(false)
  }

  return (
    <>
      <HeadInfo title='register' />
      <TempLoading loading={loading} />
      {errors.length > 0 && <div className="lg:w-[650px] md:w-[250px] mx-auto mt-6 mb-2 bg-rose-500 border-2 border-red-700 rounded-sm py-2 px-3 text-red-900 font-bold">
        {errors.map((error, index) => <div key={index}>{error}</div>)}
        <div className="flex justify-end">
          <button className="text-right bg-red-700 text-white px-3 py-1 rounded-sm" onClick={() => setErrors([])}>
            Clear
          </button>
        </div>
      </div>}
      <form onSubmit={e => e.preventDefault()} className="p-4 mt-6 grid place-content-center rounded-sm bg-neutral-900 text-white m-auto w-[650px] shadow-lg">
        <div className="text-center text-xl font-bold pb-2">
          <span className="cursor-pointer text-zinc-400" onClick={() => setPage('login')}>Sign in</span>
          <span> | </span>
          <span className="cursor-pointer">Sign up</span>
        </div>
        <div className="py-2 px-4">
          <label htmlFor="email" className="block pb-1">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className={`rounded-sm w-80 m-auto text-black py-[3px] px-[5px] border-x-2 border-y-[1px] ${(email != '' && !isValid) && 'border-red-500' || (email != '') && 'border-green-500'}`} type="email" name="email" id="email" required={true} />
        </div>
        <div className="py-2 px-4">
          <label htmlFor="username" className="block pb-1">Username</label>
          <input value={name} onChange={e => setName(e.target.value)} className="rounded-sm w-80 m-auto text-black py-[3px] px-[5px] border-2" type="text" name="username" id="username" required={true} />
        </div>
        <div className="py-2 px-4">
          <label htmlFor="pwd" className="block pb-1">Password</label>
          <input ref={pwdRef} value={password} onChange={e => setPassword(e.target.value)} className="rounded-sm w-80 text-black py-[3px] px-[5px] border-2" type="password" name="pwd" id="pwd" required={true} />
        </div>
        <div className="py-2 px-4 mt-2 flex justify-center items-center">
          <button type="submit" onClick={signup} role="button" className="mr-2 bg-blue-600 px-3 py-1 rounded-sm">Register</button>
          <button type="button" onClick={togglePwd} role="button" className="bg-neutral-600 px-3 py-1 rounded-sm">
            <i ref={iconRef} className="fas fa-eye-slash"></i>
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterPage