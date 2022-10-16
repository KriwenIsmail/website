import { useState, useRef } from "react"
import TempLoading from "../../../../components/TempLoading"

const Password = ({ user, router }) => {
  const pwdRef = useRef(null)
  const iconRef = useRef(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const changePassword = async () => {
    setLoading(true)
    if (password == '') {
      setError('password can\'t be the empty.')
      setTimeout(() => setError(''), 1500)
      return
    }
    if (password != '') {
      await fetch(`/api/membersApi/settings/changePassword?id=${user?.id}&password=${password}`)
        .then(res => res.json())
        .then(data => {
          if (!data?.success) {
            setError('something went wrong')
            setUsername('')
          } else {
            setSuccess(`Successfully changed password`)
            setTimeout(() => {
              setSuccess('')
              setTimeout(() => router.reload(), 0)
            }, 1500)
          }
        })
    }
    setLoading(false)
  }

  const togglePwd = () => {
    if (pwdRef.current != null) {
      if (pwdRef.current?.getAttribute('type') == 'password') {
        pwdRef.current?.setAttribute('type', 'text')
        iconRef.current?.classList.replace('fa-eye-slash', 'fa-eye')
      } else {
        pwdRef.current?.setAttribute('type', 'password')
        iconRef.current?.classList.replace('fa-eye', 'fa-eye-slash')
      }
    }
  }

  return (
    <>
      <TempLoading loading={loading} />
      <div className="mt-2">
        <label className="block font-medium" htmlFor="password">Password</label>
        <input ref={pwdRef} value={password} onChange={e => setPassword(e.target.value)} className="bg-gray-200 rounded py-1 px-2 border-2 dark:focus:text-white focus:border-purple-500 focus:bg-transparent font-medium inline-block text-black" type="password" id="password" name="password" />
        {password != '' && <button onClick={changePassword} className="rounded-sm cursor-pointer text-white py-1 px-3 ml-2 transition duration-100 hover:bg-green-500/70 bg-green-500">Save</button>}
        {password != '' && <button onClick={togglePwd} className="dark ml-2">
          <i className="fas fa-eye-slash" ref={iconRef}></i>
        </button>}
        {error != '' && <div className="text-red-500 italic text-sm block font-bold">{error}</div>}
        {success != '' && <div className="text-green-500 text-sm block font-bold">{success}</div>}
      </div>
    </>
  )
}

export default Password