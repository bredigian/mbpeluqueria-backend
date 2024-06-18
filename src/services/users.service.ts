import { prisma } from "./prisma.service"

export const getAll = async () => await prisma.user.findMany()
