import { Weekday } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () =>
  await prisma.weekday.findMany({
    include: { WorkhoursByWeekday: { select: { id: true, workhour: true } } },
  })

export const getOne = async (number: number) =>
  await prisma.weekday.findFirst({ where: { number } })

export const create = async (payload: Weekday) =>
  await prisma.weekday.create({ data: payload })
