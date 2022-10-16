import { PrismaClient } from "@prisma/client"

const handler = async (_, res) => {
  try {
    const prisma = new PrismaClient()
    const reports = await prisma.report.findMany()
    res.json({ data: reports })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler