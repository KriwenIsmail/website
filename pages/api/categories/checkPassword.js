import { PrismaClient } from "@prisma/client"
import { comparePassword } from "../../../lib/bcrypt"

const handler = async (req, res) => {
  try {
    const id = parseInt(req.query?.id)
    const pwd = req.query?.pwd
    const prisma = new PrismaClient()
    const category = await prisma.category.findFirst({ where: { id }, select: { password: true } })
    if (category) {
      res.json({ success: comparePassword(pwd, category.password) })
    } else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler