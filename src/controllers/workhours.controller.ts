import { Request, Response } from "express"
import { create, getAll } from "../services/workhours.service"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Workhour } from "@prisma/client"

export const Controller = {
  getAll: async (_: Request, res: Response) => {
    try {
      return res.status(200).json({ workhours: await getAll() })
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
      const payload: Workhour = req.body

      return res.status(201).json({ workhour: await create(payload) })
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
