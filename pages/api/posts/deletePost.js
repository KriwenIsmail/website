import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.id)
    const post = await prisma.post.delete({ where: { id } })
    console.log(post)
    res.json({ success: true })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler