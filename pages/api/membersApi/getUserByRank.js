import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.rank)
    const users = await prisma.user.findMany({
      where: { rankId: id },
      include: { notifications: true, posts: true, messages: true, topics: true, rank: true }
    })
    res.json({ data: users })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler