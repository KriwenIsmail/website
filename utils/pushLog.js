const pushLog = async (msg) => {
  await fetch(`/api/public/addToLog?log=${msg}`)
}

export default pushLog