import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.user_id)
    const user = await prisma.user.findFirst({
      where: { id },
      include: { notifications: true, posts: true, messages: true, topics: true, rank: true }
    })
    if (user) res.json({ data: user })
    else res.json({ data: 'null' })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler