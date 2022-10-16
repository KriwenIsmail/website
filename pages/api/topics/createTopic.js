import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const categoryId = parseInt(req.query?.cat_id)
    const userId = parseInt(req.query?.user_id)
    const title = req.query?.title
    const content = req.query?.content
    const isLocked = req.query?.locked == 'true' ? true : false
    const prisma = new PrismaClient()
    const results = await prisma.topic.create({ data: { title, userId, categoryId, isLocked } })
    if (results) {
      const post = await prisma.post.create({ data: { content, userId, topicId: results?.id } })
      if (post) res.json({ success: true, id: post.topicId })
      else res.json({ success: false })
    } else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler