import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const id = parseInt(req.query?.id)
    const name = req.query?.name
    const prisma = new PrismaClient()
    const results = await prisma.rank.update({ where: { id }, data: { name } })
    if (results) res.json({ success: true })
    else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler