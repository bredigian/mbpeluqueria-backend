import { Shift } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () =>
  await prisma.shift.findMany({
    select: {
      id: true,
      timestamp: true,
      user_id: false,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
        },
      },
    },
  })

export const create = async (payload: Shift) =>
  await prisma.shift.create({ data: payload })

export const isAssigned = async (timestamp: Date) => {
  const shift = await prisma.shift.findFirst({ where: { timestamp } })

  if (shift) return true
  else return false
}

export const getAllByUserId = async (user_id: string) =>
  await prisma.shift.findMany({ where: { user_id } })
