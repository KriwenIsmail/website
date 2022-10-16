import { PrismaClient } from "@prisma/client"
import hashPassword from "../../../lib/bcrypt"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.id)
    const password = req.query.password == '' ? '' : hashPassword(req.query?.password)
    await prisma.category.update({
      where: { id },
      data: { password }
    })
    res.json({})
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler