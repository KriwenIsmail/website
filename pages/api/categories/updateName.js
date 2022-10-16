import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.id)
    const name = req.query?.name
    await prisma.category.update({
      where: { id },
      data: { name }
    })
    res.json({})
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler