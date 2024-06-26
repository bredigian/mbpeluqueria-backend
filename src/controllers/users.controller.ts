import { Request, Response } from "express"
import { create, deleteById, getAll } from "../services/users.service"

import { EPrismaError } from "../types/prisma.types"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { User } from "@prisma/client"

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
      return res.status(500).json({ message: "Internal Server Error" })
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const payload: User = req.body

      return res.status(201).json(await create(payload))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === EPrismaError.UniqueConstraint)
          return res.status(409).json({
            message: "El usuario ya existe.",
            name: "Conflict",
            statusCode: 409,
          })

        return res.status(500).json({
          message: error.message,
          name: error.name,
          statusCode: error.code,
        })
      }
      return res.status(500).json({ message: "Internal Server Error" })
    }
  },
  deleteById: async (req: Request, res: Response) => {
    try {
      const payload: { id: string } = req.body
      const { id } = payload

      return res.status(200).json(await deleteById(id))
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
