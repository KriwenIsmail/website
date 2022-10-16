import { PrismaClient } from "@prisma/client"

const handler = async (_, res) => {
  try {
    const prisma = new PrismaClient()
    const users = await prisma.user.findMany({
      include: { notifications: true, posts: true, messages: true, topics: true, rank: true }
    }) || []
    res.json({ data: users })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler