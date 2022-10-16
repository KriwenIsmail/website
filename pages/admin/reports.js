import { useState, useEffect } from "react"
import TempLoading from "../../components/TempLoading"
import formatDate from "../../utils/formatDate"

const reportsPerPage = 10
const Logs = () => {
  const [reports, setReports] = useState([])
  const [index, setIndex] = useState(1)
  const [reportsList, setReportsList] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [pagesCount, setPagesCount] = useState([])
  const getReports = async () => {
    await fetch('/api/public/getReports')
      .then(res => res.json())
      .then(data => data?.data && setReports(data?.data))
  }

  const init = () => {
    const list = []
    for (let i = ((reportsPerPage * index) - reportsPerPage); i < (reportsPerPage * index); i++) reports[i] && list.push(reports[i])
    setReportsList(list)
  }

  const defaultReports = () => {
    if (reports.length == 0 || reports.length <= reportsPerPage) return setReportsList(reports)
    setPagesCount([])
    for (let i = 1; i <= Math.floor(reports.length / reportsPerPage); i++) setPagesCount(list => [...list, i])
    if (reports.length - (reports.length - Math.floor(reports.length / reportsPerPage)) < reportsPerPage && reports.length - (reports.length - Math.floor(reports.length / reportsPerPage)) > 0) setPagesCount(list => [...list, pagesCount.length])
    init()
  }

  useEffect(() => {
    setLoading(true)
    getReports()
    setLoading(false)
  }, [])

  useEffect(() => {
    defaultReports()
  }, [reports])

  useEffect(() => {
    init()
  }, [index])

  useEffect(() => {
    if (filterText == '') return defaultReports()
    const results = reports.filter(e => e?.content?.includes(filterText))
    if (results.length == 0 || results.length <= reportsPerPage) {
      setReportsList(results)
      return setPagesCount([])
    }
    setPagesCount([])
    for (let i = 1; i <= Math.floor(results.length / reportsPerPage); i++) setPagesCount(list => [...list, i])
    if (results.length - (results.length - Math.floor(results.length / reportsPerPage)) < reportsPerPage && results.length - (results.length - Math.floor(results.length / reportsPerPage)) > 0) setPagesCount(list => [...list, pagesCount.length])
    const list = []
    for (let i = ((reportsPerPage * index) - reportsPerPage); i < (reportsPerPage * index); i++) results[i] && list.push(results[i])
    setReportsList(list)
  }, [filterText])

  return (
    <>
      <TempLoading loading={loading} />
      <div className="border-b-2 border-b-gray-300 pb-2 dark:text-white dark:focus:text-black">
        <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)} className="px-2 py-1 rounded-sm border-2 transition duration-100 bg-gray-300 border-gray-300 focus:border-purple-600 focus:bg-transparent" />
      </div>
      <div className="overflow-y-auto max-h-96 mt-2 dark:text-white">
        {reportsList.map((_, i) => <div key={i * Math.random() * 1000} className="py-1 last:pb-0 flex items-center justify-between">
          <div>{_?.content}</div>
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