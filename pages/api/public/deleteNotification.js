import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.id)
    const results = await prisma.notification.delete({ where: { id } })
    res.json({ data: results })
    await prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler