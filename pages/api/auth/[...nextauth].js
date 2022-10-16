import NextAuth from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' }
      },
      authorize: async (credentials) => {
        const prisma = new PrismaClient()
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
          include: { rank: true }
        })
        await prisma.$disconnect()
        if (user) return user
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const prisma = new PrismaClient()
        const user_data = await prisma.user.findFirst({
          where: { id: user?.id },
          include: { rank: true }
        })
        await prisma.$disconnect()
        token.user = {
          id: user_data?.id,
          name: user_data?.name,
          username: user_data?.username,
          email: user_data?.email,
          rank: user_data?.rank,
          isBanned: user_data?.isBanned,
          avatar: user_data?.avatar
        }
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        const prisma = new PrismaClient()
        const data = await prisma.user.findFirst({ where: { id: token?.user?.id }, select: { id: true, name: true, username: true, email: true, rank: true, isBanned: true, avatar: true } })
        session.user = data
        await prisma.$disconnect()
      }
      return session
    }
  },
  secret: ']gyUVX)Mc*vZAr#e4-CI5P3gTEqBdnJ5TkEf#dwjt6gcpQ62PMN_{aa1OcLKQY5[6N/8vc[hLSgO8)D/KNQB_oAm#vrpnh)YnBnM',
  jwt: {
    secret: '6)]H8l0@Emw887bup(WG#ZNNSlfQd^8QrReo7g@_Mngv1EpOF}_stcOi*IbA84K4M2673WZRTh{a7fRBE1G^yPJpLsgu9lJN}H9^',
    encryption: true
  },
  pages: {
    signIn: '/login'
  }
})