import { Request, Response } from "express"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { WorkhoursByWeekday } from "@prisma/client"
import { enableWorkhour } from "../services/workhours-by-weekdays.service"

export const Controller = {
  enableWorkhour: async (req: Request, res: Response) => {
    try {
      const payload: WorkhoursByWeekday = req.body

      return res
        .status(201)
        .json({ workhourByWeekday: await enableWorkhour(payload) })
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
