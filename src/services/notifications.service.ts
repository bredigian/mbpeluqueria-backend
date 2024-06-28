import { TNotificationToCreate } from "../types/notifications.types"
import { prisma } from "./prisma.service"

export const getAll = async () =>
  await prisma.notification.findMany({
    select: {
      id: true,
      timestamp: true,
      description: true,
      shift: {
        select: {
          timestamp: true,
        },
      },
      User: { select: { name: true } },
      readed: true,
    },
    orderBy: { timestamp: "desc" },
  })

export const create = async (payload: TNotificationToCreate) =>
  await prisma.notification.create({ data: payload })

export const update = async (id: string) =>
  await prisma.notification.update({ where: { id }, data: { readed: true } })

export const deleteById = async (id: string) =>
  await prisma.notification.delete({ where: { id } })
