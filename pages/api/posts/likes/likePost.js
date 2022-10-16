import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const prisma = new PrismaClient()
    const id = parseInt(req.query?.post_id)
    const userId = parseInt(req.query?.user_id)
    const target = await prisma.user.findFirst({ where: { id: userId }, select: { username: true } })
    const post = await prisma.post.findFirst({
      where: { id },
      select: { likes: true, userId: true }
    })

    const likes = JSON.parse(post.likes)
    if (likes.includes(userId)) {
      const arr = likes
      arr.splice(likes.indexOf(userId), 1)
      await prisma.post.update({
        where: { id },
        data: {
          likes: JSON.stringify(arr)
        }
      })
      const user = await prisma.user.findFirst({ where: { id: post?.userId }, select: { likes: true } })
      await prisma.user.update({
        where: { id: post?.userId },
        data: { likes: user.likes - 1 }
      })
    } else {
      const arr = likes
      arr.push(userId)
      await prisma.post.update({
        where: { id },
        data: {
          likes: JSON.stringify(arr)
        }
      })
      const user = await prisma.user.findFirst({ where: { id: post?.userId }, select: { likes: true } })
      await prisma.user.update({
        where: { id: post?.userId },
        data: { likes: user.likes + 1 }
      })
      await prisma.notification.create({
        data: {
          content: `${target.username} liked your post.`,
          refersTo: `/posts/${id}`,
          type: 'like',
          userId: post?.userId
        }
      })
    }
    res.json({})
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler