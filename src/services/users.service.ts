import { User } from "@prisma/client"
import { hashPass } from "../lib/utils"
import { prisma } from "./prisma.service"

export const getAll = async () => await prisma.user.findMany()

export const getOneByEmail = async (email: string) =>
  await prisma.user.findFirst({
    where: { email: { mode: "insensitive", equals: email.toLowerCase() } },
  })

export const getOneByPhoneNumber = async (phone_number: string) =>
  await prisma.user.findFirst({ where: { phone_number } })

export const create = async (payload: User) => {
  const hash = await hashPass(payload.password)
  return await prisma.user.create({
    data: { ...payload, email: payload.email.toLowerCase(), password: hash },
  })
}

export const update = async (id: string, password: string) => {
  const hash = await hashPass(password)
  return await prisma.user.update({
    where: { id },
    data: { password: hash, token: null },
    select: {
      id: true,
      name: true,
      phone_number: true,
      email: true,
      role: true,
      password: false,
    },
  })
}

export const deleteById = async (id: string) =>
  await prisma.user.delete({ where: { id } })

export const setTokenById = async (id: string, token: string) =>
  await prisma.user.update({ where: { id }, data: { token } })
