import { WorkhoursByWeekday } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () =>
  await prisma.workhoursByWeekday.findMany({
    select: { id: true, weekday: true, workhour: true },
  })

// export const getAllEnabledAndAvailable = async () => {
//   const enabledWorkhoursByWeekdays = await getAll()
//   for (const day of enabledWorkhoursByWeekdays) {

//   }
// }

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
