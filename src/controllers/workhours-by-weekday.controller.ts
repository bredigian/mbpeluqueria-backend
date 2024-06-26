import { Request, Response } from "express"
import {
  disableWorkhour,
  enableWorkhour,
  getAll,
  workhourIsEnabled,
} from "../services/workhours-by-weekdays.service"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { WorkhoursByWeekday } from "@prisma/client"

export const Controller = {
  handleWorkhour: async (req: Request, res: Response) => {
    try {
      const payload: WorkhoursByWeekday = req.body

      const isEnabled = await workhourIsEnabled(
        payload.weekday_id,
        payload.workhour_id
      )

      if (!isEnabled) return res.status(201).json(await enableWorkhour(payload))

      return res
        .status(200)
        .json(await disableWorkhour(payload.weekday_id, payload.workhour_id))
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
}
