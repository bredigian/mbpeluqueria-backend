import { Workhour } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () => await prisma.workhour.findMany()

export const getOne = async ({ hours, minutes }: Props) =>
  await prisma.workhour.findFirst({ where: { hours, minutes } })

export const create = async (payload: Workhour) =>
  await prisma.workhour.create({ data: payload })

type Props = {
  hours: number
  minutes: number
}
