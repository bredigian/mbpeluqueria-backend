import { Request, Response } from "express"
import {
  create,
  deleteById,
  getAll,
  update,
} from "../services/notifications.service"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { TNotificationToCreate } from "../types/notifications.types"

export const Controller = {
  getAll: async (_: Request, res: Response) => {
    try {
      return res.status(200).json(await getAll())
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          statusCode: error.code,
        })
      }
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload: TNotificationToCreate = req.body
      return res.status(201).json(await create(payload))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          statusCode: error.code,
        })
      }
      return res.status(500).json({ message: "Internal Server Error" })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.query
      if (!id)
        return res.status(403).json({
          message: "El ID de la notificación es requerido.",
          name: "Forbidden",
          statusCode: 403,
        })

      return res.status(200).json(await update(id as string))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          statusCode: error.code,
        })
      }
      return res.status(500).json({ message: "Internal Server Error" })
    }
  },

  deleteById: async (req: Request, res: Response) => {
    try {
      const { id } = req.query
      if (!id)
        return res.status(403).json({
          message: "El ID de la notificación es requerido.",
          name: "Forbidden",
          statusCode: 403,
        })

      return res.status(200).json(await deleteById(id as string))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          statusCode: error.code,
        })
      }
      return res.status(500).json({ message: "Internal Server Error" })
    }
  },
}
