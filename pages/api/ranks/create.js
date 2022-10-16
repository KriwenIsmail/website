import { PrismaClient } from "@prisma/client"

const handler = async (req, res) => {
  try {
    const {
      name,
      color,
      admin,
      deletePosts: delete_posts,
      deleteUsers: delete_users,
      hidePosts: hide_posts,
      lockPosts: lock_posts,
      lockTopics: lock_topics,
      manageCategories: manage_categories,
      manageRoles: manage_roles,
      verifyUsers: verify_users,
      deleteTopics: delete_topics,
      hideTopics: hide_topics,
      accessDashboard: access_dashboard,
      manageSettings: manage_settings,
      restoreUsers: restore_users,
      banUsers: ban_users
    } = JSON.parse(req.query?.data)
    const prisma = new PrismaClient()
    const ranks = await prisma.rank.findMany()
    if (ranks) {
      const results = await prisma.rank.create({
        data: {
          name,
          color: `#${color}`,
          admin,
          delete_posts,
          delete_users,
          lock_posts,
          lock_topics,
          manage_categories,
          manage_roles,
          verify_users,
          access_dashboard,
          manage_settings,
          restore_users,
          hide_topics,
          delete_topics,
          ban_users,
          order: ranks.length + 1
        }
      })
      if (results) res.json({ data: results })
      else res.json({})
    } else res.json({})
    return prisma.$disconnect()
  } catch (e) {
    if (e) throw Error(e)
  }
}

export default handler