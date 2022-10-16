import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const id = parseInt(req.query?.id)
    const prisma = new PrismaClient()
    const category = await prisma.category.findFirst({
      where: { id },
      include: { topics: true }
    })
    res.json({ data: category })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler