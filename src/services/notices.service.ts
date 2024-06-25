import { Notice } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () =>
  await prisma.notice.findMany({ orderBy: { timestamp: "desc" } })

export const create = async (payload: Notice) =>
  await prisma.notice.create({ data: payload })

export const deleteOne = async (id: string) =>
  await prisma.notice.delete({ where: { id } })
