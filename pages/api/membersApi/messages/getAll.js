import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const userId = parseInt(req.query?.id)
    const prisma = new PrismaClient()
    const messages = await prisma.message.findMany({ where: { userId } })
    res.json({ data: messages })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler