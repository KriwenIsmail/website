import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const name = req.query?.name
    const user = await prisma.user.findFirst({
      where: { name: name },
      include: { notifications: true, posts: true, messages: true, topics: true, rank: true }
    })
    res.json({ data: user })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler