import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const name = req.query?.name
    const user = await prisma.user.findFirst({ where: { username: name } })
    if (user) {
      const results = await prisma.user.update({
        where: { username: name },
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