import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const value = req.query?.value == 'true' ? true : false
    const settingIndex = await prisma.settings.findFirst()
    await prisma.settings.update({
      where: { id: settingIndex.id },
      data: { memberVerification: value }
    })
    res.json({})
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler