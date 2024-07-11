import { Request, Response } from "express"
import { create, getAll } from "../services/weekdays.service"

import { DateTime } from "luxon"
import { IWeekdayWithAssignedShifts } from "../types/weekdays.types"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Weekday } from "@prisma/client"
import { getAllNextShifts } from "../services/shifts.service"

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
  getAllWithUnavailableWorkhours: async (_: Request, res: Response) => {
    try {
      const weekdays = await getAll()
      const unavailableShifts = await getAllNextShifts()

      const weekdaysWithUnavailableWorkhours: IWeekdayWithAssignedShifts[] =
        weekdays.map((weekday) => {
          const shiftsOfWeekday = unavailableShifts.filter((shift) => {
            const jsDate = new Date(shift.timestamp)
            const date = DateTime.fromJSDate(jsDate).setZone(
              "America/Argentina/Buenos_Aires"
            )
            return weekday.number === (date.weekday === 7 ? 0 : date.weekday)
          })
          return {
            ...weekday,
            assignedWorkhours: shiftsOfWeekday,
          }
        })

      return res.status(200).json(weekdaysWithUnavailableWorkhours)
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
      const payload: Weekday = req.body

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
}
