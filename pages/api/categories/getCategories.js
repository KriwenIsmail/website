import { PrismaClient } from "@prisma/client"

const handler = async (_, res) => {
  try {
    const prisma = new PrismaClient()
    const categories = await prisma.category.findMany({ include: { topics: true } })
    res.json({ data: categories })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler