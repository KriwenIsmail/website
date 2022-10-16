import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const cat_id = parseInt(req.query?.id)
    const prisma = new PrismaClient()
    const topics = await prisma.topic.findMany({
      where: { categoryId: cat_id },
      include: { posts: true, category: true, author: true }
    })
    res.json({ data: topics })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler