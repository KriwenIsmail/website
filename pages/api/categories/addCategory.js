import { PrismaClient } from "@prisma/client"
import hashPassword from "../../../lib/bcrypt"

const handler = async (req, res) => {
  try {
    const cat_data = JSON.parse(req.query?.data)
    const prisma = new PrismaClient()
    const categories = await prisma.category.findMany()
    if (categories) {
      const { title, theme, description, password: pwd, isVisible, adminsOnly, allowGuests, allowedGroups } = cat_data
      const password = pwd == '' ? '' : hashPassword(pwd)
      const order = categories.length + 1
      const results = await prisma.category.create({
        data: { name: title, password, description, isVisible, adminsOnly, allowedGroups, allowGuests, theme: `#${theme}`, order }
      })
      if (results) res.json({ success: true, data: results })
      else res.json({ success: false })
    } else res.json({ sucess: false })
    res.json({ success: false })
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler