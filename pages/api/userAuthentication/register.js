import { PrismaClient } from "@prisma/client"
import hashPassword from "../../../lib/bcrypt"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const { name, email, password } = req.query
    const hashedPassword = hashPassword(password)
    const user = await prisma.user.findFirst({ where: { email } }) || await prisma.user.findFirst({ where: { name } }) || await prisma.user.findFirst({ where: { username: name } })
    if (user) res.json({ user_found: true })
    else {
      const newUser = await prisma.user.create({
        data: {
          name,
          username: name,
          email,
          password: hashedPassword,
        }
      })
      if (newUser) {
        const memberApprovalActivated = await prisma.settings.findFirst({
          where: { id: 1 },
          select: { memberVerification: true }
        })
        if (memberApprovalActivated?.memberVerification) {
          const admins = await prisma.user.findMany({
            where: { rank: { verify_users: true } },
            select: { id: true }
          }) || []
          admins?.map(async (_) => {
            await prisma.notification.create({
              data: {
                userId: _?.id,
                content: `${newUser?.name} has joined and needs to be verified.`,
                type: 'member approval'
              }
            })
          })
        }
        res.json({ user_found: false })
      }
    }
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler