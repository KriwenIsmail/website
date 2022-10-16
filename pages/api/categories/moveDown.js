import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const id = parseInt(req.query?.id)
    const index = parseInt(req.query?.index)
    const prisma = new PrismaClient()
    const target = await prisma.category.findFirst({
      where: { order: index + 1 },
      select: { id: true, order: true }
    })
    if (target) {
      const results = await prisma.category.update({
        where: { id },
        data: { order: target.order }
      })
      if (results) {
        await prisma.category.update({
          where: { id: target.id },
          data: { order: index }
        })
        res.json({ success: true })
      }
    }
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler