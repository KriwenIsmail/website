import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const user_id = parseInt(req.query?.user_id)
    const user = await prisma.user.findFirst({ where: { id: user_id } })
    if (user) {
      const results = await prisma.user.update({
        where: { id: user_id },
        data: { isVerified: true }
      })
      if (results) res.json({ success: true })
      else res.json({ success: false })
    } else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler