import { WorkhoursByWeekday } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () =>
  await prisma.workhoursByWeekday.findMany({
    select: { id: true, weekday: true, workhour: true },
  })

export const workhourIsEnabled = async (
  weekdayId: string,
  workhourId: string
) =>
  await prisma.workhoursByWeekday.findFirst({
    where: { weekday_id: weekdayId, workhour_id: workhourId },
  })

export const enableWorkhour = async (payload: WorkhoursByWeekday) =>
  await prisma.workhoursByWeekday.create({ data: payload })

export const disableWorkhour = async (weekdayId: string, workhourId: string) =>
  await prisma.workhoursByWeekday.deleteMany({
    where: { weekday_id: weekdayId, workhour_id: workhourId },
  })
