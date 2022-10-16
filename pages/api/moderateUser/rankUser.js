import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const session = await getSession({ req, res })
    const user_id = parseInt(req.query?.user_id)
    const new_rank = req.query?.rank
    const target_user = await prisma.user.findFirst({ where: { id: user_id }, select: { rank: true, username: true } })
    const rank = await prisma.rank.findFirst({ where: { name: new_rank } })
    if (rank) {
      const results = await prisma.user.update({ where: { id: user_id }, data: { rankId: rank?.id }, select: { rank: true } })
      if (results) {
        const promoted = target_user?.rank?.admin == results?.rank?.admin
        await prisma.notification.create({
          data: {
            content: `You got ${promoted ? 'promoted' : 'demoted'}`,
            type: 'rank update',
            userId: user_id
          }
        })
        await prisma.log.create({ data: { log: `${session?.user?.username} changed ${target_user?.username}'s rank to ${results?.rank?.name}` } })
        res.json({ success: true })
      }
      else res.json({ success: false })
    } else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler