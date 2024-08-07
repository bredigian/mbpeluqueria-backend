import { Workhour } from "@prisma/client"
import { prisma } from "./prisma.service"

type Props = {
  hours: number
  minutes: number
}

export const getAll = async () =>
  await prisma.workhour.findMany({
    orderBy: [{ hours: "asc" }, { minutes: "asc" }],
  })

export const getOne = async ({ hours, minutes }: Props) =>
  await prisma.workhour.findFirst({ where: { hours, minutes } })

export const create = async (payload: Workhour) =>
  await prisma.workhour.create({ data: payload })
