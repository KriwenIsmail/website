import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const user_id = parseInt(req.query?.user_id)
    const notifications = await prisma.notification.findMany({
      where: { userId: user_id },
    })
    res.json({ data: notifications })
    await prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler