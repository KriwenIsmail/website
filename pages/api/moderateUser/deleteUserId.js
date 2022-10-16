import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    let user_id = parseInt(req.query?.user_id)
    const results = await prisma.user.update({ where: { id: user_id }, data: { active: false } })
    if (results) res.json({ success: true })
    else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler