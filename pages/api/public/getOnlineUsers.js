import { PrismaClient } from "@prisma/client"

const handler = async (_, res) => {
  const prisma = new PrismaClient()
  const users = await prisma.user.findMany({ where: { online: true }, include: { rank: true } })
  res.json({ data: users })
  return prisma.$disconnect()
}

export default handler