const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcrypt")
const prisma = new PrismaClient()

const main = async () => {
  await prisma.rank.create({
    data: {
      name: 'member',
      color: '#0284c7',
      admin: false,
      verify_users: false,
      delete_posts: false,
      delete_topics: false,
      delete_users: false,
      ban_users: false,
      lock_posts: false,
      lock_topics: false,
      hide_posts: false,
      hide_topics: false,
      access_dashboard: false,
      manage_categories: false,
      manage_roles: false,
      manage_settings: false,
      restore_users: false,
      order: 2
    }
  })
  await prisma.rank.create({
    data: {
      name: 'owner',
      color: '#c2410c',
      admin: true,
      verify_users: true,
      delete_posts: true,
      delete_topics: true,
      delete_users: true,
      ban_users: true,
      lock_posts: true,
      lock_topics: true,
      hide_posts: true,
      hide_topics: true,
      access_dashboard: true,
      manage_categories: true,
      manage_roles: true,
      manage_settings: true,
      restore_users: true,
      order: 1
    }
  })
  await prisma.settings.create({
    data: {
      title: 'Ismail\'s Forum',
      slogan: '-'
    }
  })
  await prisma.user.create({
    data: {
      name: 'admin',
      username: 'admin',
      password: bcrypt.hashSync('admin123', bcrypt.genSaltSync(10)),
      email: 'admin@admin.com',
      rankId: 2
    }
  })
}

main().catch(e => {
  console.log(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())