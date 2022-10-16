import { useEffect, useState } from "react"
import { SessionProvider } from "next-auth/react"
import Navbar from '../components/Navbar'
import '@fortawesome/fontawesome-free/css/all.css'
import '../styles/globals.css'

const App = ({ Component, pageProps }) => {
  const [lastTheme, setLastTheme] = useState('light')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (typeof window == 'object') {
      if (window.localStorage.getItem('theme')) setTheme(window.localStorage.getItem('theme'))
      else window.localStorage.setItem('theme', 'light')
    }
  }, [])

  useEffect(() => {
    if (theme != lastTheme) {
      typeof window == 'object' && window.localStorage.setItem('theme', theme);
    }
    if (theme == 'dark') {
      typeof document == 'object' && document.documentElement.classList.add('dark');
      setLastTheme('dark')
    } else {
      (typeof document == 'object' && document.documentElement.classList.contains('dark')) && document.documentElement.classList.remove('dark');
      setLastTheme('light')
    }
  }, [theme])

  return (
    <SessionProvider>
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="min-w-screen min-h-screen dark:text-white dark:bg-stone-900">
        <div className="container py-16">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  )
}

export default App