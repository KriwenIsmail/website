import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query.id)
    const bio = req.query.bio
    const results = await prisma.user.update({
      where: { id },
      data: { bio }
    })
    if (results) res.json({ success: true })
    else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler