import Head from "next/head"
import { useEffect, useState } from "react"

const HeadInfo = ({ title, titleFirst = false }) => {
  const [info, setInfo] = useState({})
  const siteInfo = async () => {
    await fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => data?.data && setInfo(data?.data))
  }

  useEffect(() => {
    siteInfo()
  }, [])

  return (
    <Head>
      {titleFirst && <title>{`${title || ''} ${info?.slogan || ''} ${info?.title || ''}`}</title> || <title>{`${info?.title || ''} ${info?.slogan || ''} ${title || ''}`}</title>}
    </Head>
  )
}

export default HeadInfo