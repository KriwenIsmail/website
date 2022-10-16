import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const results = await prisma.notification.count({ where: { read: false } })
    res.json({ data: results })
    await prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler