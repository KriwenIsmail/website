import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const categories = await prisma.category.count()
    const posts = await prisma.post.count()
    const topics = await prisma.topic.count()
    const members = await prisma.user.count()
    const members_list = await prisma.user.findMany({ select: { id: true, username: true, rank: true } })
    const latest_user = members_list[members - 1]
    res.json({ categories, posts, topics, members, latest_user })
    await prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler