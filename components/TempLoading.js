const TempLoading = ({ loading }) => {
  return (
    <>
      {loading && <div className="fixed inset-0 bg-black/[.35] z-[999999]">
        <div className="w-9 aspect-square rounded-full border-[3px] fixed top-4 left-1/2 -translate-x-1/2 border-neutral-300 border-t-sky-600 temp-spin"></div>
      </div>}
    </>
  )
}

export default TempLoading