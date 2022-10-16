import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const topicId = parseInt(req.query?.topic_id)
    const posts = await prisma.post.findMany({
      where: { topicId },
      include: { author: true }
    })
    res.json({ data: posts })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler