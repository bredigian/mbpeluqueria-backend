import { DateTime } from "luxon"
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
          phone_number: true,
          role: true,
        },
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  })

export const getOfSpecificDate = async (
  specificDate: DateTime,
  nextDate: DateTime
) =>
  await prisma.shift.findMany({
    where: {
      timestamp: {
        gte: specificDate.toUTC().toISO() as string,
        lt: nextDate.toUTC().toISO() as string,
      },
    },
    select: {
      id: true,
      timestamp: true,
      user_id: false,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          role: true,
        },
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  })

export const getAllNextShifts = async () => {
  const today = DateTime.now()
    .toUTC()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

  return await prisma.shift.findMany({
    where: { timestamp: { gte: today.toISO() as string } },
  })
}

export const getAllNextShiftsByUserId = async (id: string) => {
  const today = DateTime.now().toUTC().toISO()
  console.log(today)
  return await prisma.shift.findMany({
    where: { user_id: id, timestamp: { gte: today } },
    orderBy: { timestamp: "asc" },
  })
}

export const create = async (payload: Shift) =>
  await prisma.shift.create({
    data: payload,
    select: {
      id: true,
      timestamp: true,
      user: { select: { id: true, name: true } },
    },
  })

export const isAssigned = async (timestamp: Date) => {
  const shift = await prisma.shift.findFirst({ where: { timestamp } })

  if (shift) return true
  else return false
}

export const getAllByUserId = async (user_id: string) =>
  await prisma.shift.findMany({
    where: { user_id },
    orderBy: { timestamp: "desc" },
  })

export const deleteById = async (id: string) =>
  await prisma.shift.delete({
    where: { id },
    select: {
      id: true,
      timestamp: true,
      user: { select: { id: true, name: true } },
    },
  })
