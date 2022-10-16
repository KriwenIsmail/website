import { getSession } from "next-auth/react"

const Profile = () => <></>

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  if (session && session?.user) return {
    redirect: {
      destination: `/profile/${session?.user?.id}`,
      permanent: false
    }
  }
  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }
}

export default Profile