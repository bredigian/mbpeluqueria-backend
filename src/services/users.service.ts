import { User } from "@prisma/client"
import { prisma } from "./prisma.service"

export const getAll = async () => await prisma.user.findMany()

export const getOne = async (username: string) =>
  await prisma.user.findFirst({ where: { username } })

export const create = async (payload: User) =>
  await prisma.user.create({ data: payload })

export const deleteById = async (id: string) =>
  await prisma.user.delete({ where: { id } })
