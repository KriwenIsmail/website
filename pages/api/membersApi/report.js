import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const content = req.query.content
    const reportedId = parseInt(req.query.reported)
    const reporterId = parseInt(req.query.reporter)
    await prisma.report.create({
      data: {
        content,
        reporterId,
        reportedId
      }
    })
    res.json({})
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler