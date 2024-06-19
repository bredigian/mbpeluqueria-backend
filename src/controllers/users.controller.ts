import { Request, Response } from "express"
import { create, deleteById, getAll } from "../services/users.service"

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
          errorCode: error.code,
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
        return res.status(500).json({
          name: error.name,
          message: error.message,
          errorCode: error.code,
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
          errorCode: error.code,
        })
      }
      return res.status(500).json({ message: "Internal Server Error" })
    }
  },
}
