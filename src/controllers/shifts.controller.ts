import { Request, Response } from "express"
import { create, getAll } from "../services/shifts.service"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Shift } from "@prisma/client"
import { exists } from "../services/weekdays.service"
import { exists as existsWorkhour } from "../services/workhours.service"

export const Controller = {
  getAll: async (_: Request, res: Response) => {
    try {
      return res.status(200).json({ shifts: await getAll() })
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
      const payload: Shift = req.body
      const { timestamp } = payload
      const date = new Date(timestamp)

      if (!(await exists(date.getDay())))
        return res.status(404).json({
          message: `El día semanal ${date.getDay()} no está registrado en el sistema.`,
          name: "Not Found",
          statusCode: 404,
        })

      if (
        !(await existsWorkhour({
          hours: date.getHours(),
          minutes: date.getMinutes(),
        }))
      )
        return res.status(404).json({
          message: `El horario de trabajo ${date.getHours()}:${date.getMinutes()} no está registrado en el sistema.`,
          name: "Not Found",
          statusCode: 404,
        })

      return res.status(201).json({ shift: await create(payload) })
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
