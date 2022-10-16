import { useState, useEffect } from "react"
import TempLoading from "../../components/TempLoading"
import formatDate from "../../utils/formatDate"

const logsPerPage = 10
const Logs = () => {
  const [logs, setLogs] = useState([])
  const [index, setIndex] = useState(1)
  const [logsList, setLogsList] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [pagesCount, setPagesCount] = useState([])
  const getLogs = async () => {
    await fetch('/api/public/getLogs')
      .then(res => res.json())
      .then(data => data?.data && setLogs(data?.data))
  }

  const init = () => {
    const list = []
    for (let i = ((logsPerPage * index) - logsPerPage); i < (logsPerPage * index); i++) logs[i] && list.push(logs[i])
    setLogsList(list)
  }

  const defaultLogs = () => {
    if (logs.length == 0 || logs.length <= logsPerPage) return setLogsList(logs)
    setPagesCount([])
    for (let i = 1; i <= Math.floor(logs.length / logsPerPage); i++) setPagesCount(list => [...list, i])
    if (logs.length - (logs.length - Math.floor(logs.length / logsPerPage)) < logsPerPage && logs.length - (logs.length - Math.floor(logs.length / logsPerPage)) > 0) setPagesCount(list => [...list, pagesCount.length])
    init()
  }

  useEffect(() => {
    setLoading(true)
    getLogs()
    setLoading(false)
  }, [])

  useEffect(() => {
    defaultLogs()
  }, [logs])

  useEffect(() => {
    init()
  }, [index])

  useEffect(() => {
    if (filterText == '') return defaultLogs()
    const results = logs.filter(e => e?.log?.includes(filterText))
    if (results.length == 0 || results.length <= logsPerPage) {
      setLogsList(results)
      return setPagesCount([])
    }
    setPagesCount([])
    for (let i = 1; i <= Math.floor(results.length / logsPerPage); i++) setPagesCount(list => [...list, i])
    if (results.length - (results.length - Math.floor(results.length / logsPerPage)) < logsPerPage && results.length - (results.length - Math.floor(results.length / logsPerPage)) > 0) setPagesCount(list => [...list, pagesCount.length])
    const list = []
    for (let i = ((logsPerPage * index) - logsPerPage); i < (logsPerPage * index); i++) results[i] && list.push(results[i])
    setLogsList(list)
  }, [filterText])

  return (
    <>
      <TempLoading loading={loading} />
      <div className="border-b-2 border-b-gray-300 pb-2 dark:text-white dark:focus:text-black">
        <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)} className="px-2 py-1 rounded-sm border-2 transition duration-100 bg-gray-300 border-gray-300 focus:border-purple-600 focus:bg-transparent" />
      </div>
      <div className="overflow-y-auto max-h-96 mt-2 dark:text-white">
        {logsList.map((_, i) => <div key={i * Math.random() * 1000} className="py-1 last:pb-0 flex items-center justify-between">
          <div>{_?.log}</div>
          {_ && <div className="font-light">
            {formatDate(_?.date).MONTH} {formatDate(_?.date).DAY}, {formatDate(_?.date).YEAR} at {formatDate(_?.date).HOURS}:{formatDate(_?.date).MINUTES}
          </div>}
        </div>)}
      </div>
      <div className="mt-4 flex items-center justify-center">
        {pagesCount.map((_, i) => <button onClick={() => setIndex(_)} className={`bg-purple-500 ml-2 first:ml-0 ${index == _ ? 'bg-purple-900' : 'hover:bg-purple-500/70'}`} key={i * Math.random() * 1000}>{_}</button>)}
      </div>
    </>
  )
}

export default Logs