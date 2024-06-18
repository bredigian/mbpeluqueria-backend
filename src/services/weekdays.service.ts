import { Weekday } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () => await prisma.weekday.findMany()

export const create = async (payload: Weekday) =>
  await prisma.weekday.create({ data: payload })

export const exists = async (number: number) =>
  await prisma.weekday.findFirst({ where: { number } })
