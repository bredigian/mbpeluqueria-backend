import { Request, Response } from "express"
import { create, deleteOne, getAll } from "../services/notices.service"

import { Notice } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const Controller = {
  getAll: async (_: Request, res: Response) => {
    try {
      return res.status(200).json(await getAll())
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          errorCode: error.code,
        })
      }
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const payload: Notice = req.body

      return res.status(201).json(await create(payload))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          errorCode: error.code,
        })
      }
    }
  },

  deleteOne: async (req: Request, res: Response) => {
    try {
      const { id } = req.query
      if (!id)
        return res.status(403).json({
          message: "El ID es requerido.",
          name: "Forbidden",
          statusCode: 403,
        })

      return res.status(200).json(await deleteOne(id as string))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          errorCode: error.code,
        })
      }
    }
  },
}
