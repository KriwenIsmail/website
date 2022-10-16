import { PrismaClient } from "@prisma/client"
import hashPassword from "../../../../lib/bcrypt"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const user_id = parseInt(req.query.id)
    const password = req.query.password
    const hashedPassword = hashPassword(password)
    const results = await prisma.user.update({
      where: { id: user_id },
      data: { password: hashedPassword }
    })
    if (results) res.json({ success: true })
    else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler