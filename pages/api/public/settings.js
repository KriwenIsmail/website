import { PrismaClient } from "@prisma/client"

const handler = async (_, res) => {
  try {
    const prisma = new PrismaClient()
    const data = await prisma.settings.findFirst()
    res.json({ data: data })
    await prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler