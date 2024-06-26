import { User } from "@prisma/client"
import { hashPass } from "../lib/utils"
import { prisma } from "./prisma.service"

export const getAll = async () => await prisma.user.findMany()

export const getOne = async (email: string, phoneNumber: string) =>
  await prisma.user.findFirst({ where: { email, phone_number: phoneNumber } })

export const create = async (payload: User) => {
  const hash = await hashPass(payload.password)
  return await prisma.user.create({ data: { ...payload, password: hash } })
}

export const deleteById = async (id: string) =>
  await prisma.user.delete({ where: { id } })
