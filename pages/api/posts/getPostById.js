import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.id)
    const posts = await prisma.post.findMany({
      where: { id },
      include: { author: true }
    })
    res.json({ data: posts })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler