import { PrismaClient } from "@prisma/client"

const handler = async (_, res) => {
  try {
    const prisma = new PrismaClient()
    const ranks = await prisma.rank.findMany() || []
    res.json({ data: ranks })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler