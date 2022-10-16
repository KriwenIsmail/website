import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const id = parseInt(req.query?.id)
    const color = req.query?.color
    const prisma = new PrismaClient()
    const results = await prisma.rank.update({ where: { id }, data: { color: `#${color}` } })
    if (results) res.json({ success: true })
    else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler