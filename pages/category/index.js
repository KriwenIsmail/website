const Category = () => <></>

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/',
      permanent: false
    }
  }
}

export default Category