import { PrismaClient } from "@prisma/client"

const handler = async (_, res) => {
  try {
    const prisma = new PrismaClient()
    const logs = await prisma.log.findMany()
    res.json({ data: logs })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler