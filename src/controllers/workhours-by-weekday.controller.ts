import { Request, Response } from "express"
import {
  enableWorkhour,
  getAll,
} from "../services/workhours-by-weekdays.service"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { WorkhoursByWeekday } from "@prisma/client"

export const Controller = {
  enableWorkhour: async (req: Request, res: Response) => {
    try {
      const payload: WorkhoursByWeekday = req.body

      return res.status(201).json(await enableWorkhour(payload))
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
}
