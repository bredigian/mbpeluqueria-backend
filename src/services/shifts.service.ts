import { Shift } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () => await prisma.shift.findMany()

export const create = async (payload: Shift) =>
  await prisma.shift.create({ data: payload })

export const isAssigned = async (timestamp: Date) => {
  const shift = await prisma.shift.findFirst({ where: { timestamp } })

  if (shift) return true
  else return false
}
