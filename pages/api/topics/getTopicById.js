import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const id = parseInt(req.query?.id)
    const prisma = new PrismaClient()
    const topic = await prisma.topic.findFirst({
      where: { id },
      include: { posts: true, category: true, author: true }
    })
    res.json({ data: topic })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler