import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.id)
    const value = req.query?.value
    await prisma.category.update({
      where: { id },
      data: { allowedGroups: value }
    })
    if (JSON.parse(value).length > 0) {
      await prisma.category.update({
        where: { id },
        data: { allowGuests: false }
      })
    }
    res.json({})
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler