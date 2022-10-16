const PageLoading = ({ loading }) => {
  return (
    <>
      {loading && <div className="fixed inset-0 bg-black z-[99999999]">
        <div className="w-14 aspect-square rounded-full border-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-neutral-100 border-t-sky-600 full-page-spin"></div>
      </div>}
    </>
  )
}

export default PageLoading