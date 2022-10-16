const Posts = () => { }

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/',
      permanent: false
    }
  }
}

export default Posts