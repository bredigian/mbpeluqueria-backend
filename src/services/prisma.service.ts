import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const $connect = async () => {
  try {
    await prisma.$connect()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

const $disconnect = async () => {
  try {
    await prisma.$disconnect()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { prisma, $connect, $disconnect }
