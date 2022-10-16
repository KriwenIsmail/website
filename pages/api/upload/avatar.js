import { IncomingForm } from "formidable"
import { PrismaClient } from "@prisma/client"

const mv = require('mv')

export const config = {
  api: {
    bodyParser: false
  }
}

const updateUserInfo = async (id, avatar) => {
  const prisma = new PrismaClient()
  await prisma.user.update({
    where: { id },
    data: { avatar }
  })
  return await prisma.$disconnect()
}

export default async (req, res) => {
  await new Promise((_, reject) => {
    const form = new IncomingForm()

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      const oldPath = files.file.filepath
      const newPath = `./public/assets/avatars/${files.file.originalFilename}`
      updateUserInfo(parseInt(req.query.id), files.file.originalFilename)
      mv(oldPath, newPath, err => err)
      res.json({ success: true })
    })
  })
}
