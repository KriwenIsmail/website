import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const poster = parseInt(req.query?.poster)
    const topicId = parseInt(req.query?.topicId)
    const content = req.query?.content
    const quote = parseInt(req.query?.quote) || 0
    const quotedUser = parseInt(req.query?.quoteUserId) || 0
    const tags = JSON.parse(req.query?.tags) || []
    console.log(tags, tags.length)
    const post = await prisma.post.create({ data: { content, quote, userId: poster, topicId, tags: JSON.stringify(tags) } })
    if (tags.length > 0) {
      const topic = await prisma.topic.findFirst({
        where: { id: topicId },
        select: { title: true }
      })
      const user = await prisma.user.findFirst({
        where: { id: poster }
      })
      tags.map(async (_) => {
        const taggedUser = await prisma.user.findFirst({
          where: { name: _ }
        })
        if (taggedUser && topic && taggedUser?.id != user?.id) {
          await prisma.notification.create({
            data: {
              content: `${user?.username} tagged you in ${topic.title}`,
              refersTo: `/posts/${topicId}`,
              userId: taggedUser?.id,
              type: 'quote'
            }
          })
        }
      })
    }
    if (quote > 0 && post) {
      const topic = await prisma.topic.findFirst({
        where: { id: topicId },
        select: { title: true }
      })
      const user = await prisma.user.findFirst({
        where: { id: poster }
      })
      if (user && topic) {
        if (poster != quotedUser) {
          await prisma.notification.create({
            data: {
              content: `${user?.username} quoted you in ${topic.title}`,
              refersTo: `/posts/${topicId}`,
              userId: quotedUser,
              type: 'quote'
            }
          })
        }
      }
    }
    res.json({ data: post })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler