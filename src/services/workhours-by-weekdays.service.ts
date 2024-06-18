import { WorkhoursByWeekday } from "@prisma/client"
import { prisma } from "./prisma.service"

export const workhourIsEnabled = async (
  workhourId: string,
  weekdayId: string
) =>
  await prisma.workhoursByWeekday.findFirst({
    where: { weekday_id: weekdayId, workhour_id: workhourId },
  })

export const enableWorkhour = async (payload: WorkhoursByWeekday) =>
  await prisma.workhoursByWeekday.create({ data: payload })

// export const disableWorkhour = async (id)
