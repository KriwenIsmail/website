import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.id)
    const isHidden = req.query?.value == 'true' ? false : true
    console.log(id, isHidden)
    const post = await prisma.post.update({ where: { id }, data: { isHidden } })
    if (post) res.json({ success: true })
    else res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler