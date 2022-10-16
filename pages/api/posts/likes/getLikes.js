import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.post_id)
    const posts = await prisma.post.findFirst({
      where: { id },
      select: {
        likes: true
      }
    })
    res.json({ data: posts })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler