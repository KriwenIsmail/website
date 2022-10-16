import { PrismaClient } from "@prisma/client"
import { comparePassword } from "../../../lib/bcrypt"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const { email, password } = req.query
    const user = await prisma.user.findFirst({ where: { email } })
    if (user) {
      const passwordsEqual = comparePassword(password, user?.password)
      if (passwordsEqual) {
        if (user.active) res.json({ data: user })
        else res.json({ data: null })
      }
      else res.json({ message: 'incorrect password' })
    } else res.json({ data: null })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler