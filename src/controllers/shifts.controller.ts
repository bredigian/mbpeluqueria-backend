import { Request, Response } from "express"
import {
  create,
  getAll,
  getAllByUserId,
  isAssigned,
} from "../services/shifts.service"
import { decodeToken, verifyToken } from "../services/auth.service"

import { JwtPayload } from "jsonwebtoken"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Shift } from "@prisma/client"
import { getOne } from "../services/weekdays.service"
import { getOne as getOneWorkhour } from "../services/workhours.service"
import { workhourIsEnabled } from "../services/workhours-by-weekdays.service"

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
  getAllByUserId: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.substring(7)
      if (!token)
        return res.status(403).json({
          message: "El token es requerido.",
          name: "Forbidden",
          statusCode: 403,
        })

      const authorized = verifyToken(token)
      if (!authorized)
        return res.status(401).json({
          message: "El token es inválido o ya caducó.",
          name: "Unauthorized",
          statusCode: 401,
        })

      const { id } = decodeToken(token) as JwtPayload

      return res.status(200).json({ shifts: await getAllByUserId(id) })
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

      const weekday = await getOne(date.getDay())

      if (!weekday)
        return res.status(404).json({
          message: `El día semanal ${date.getDay()} no está registrado en el sistema.`,
          name: "Not Found",
          statusCode: 404,
        })

      const workhour = await getOneWorkhour({
        hours: date.getHours(),
        minutes: date.getMinutes(),
      })
      if (!workhour)
        return res.status(404).json({
          message: `El horario de trabajo ${date.getHours()}:${date.getMinutes()} no está registrado en el sistema.`,
          name: "Not Found",
          statusCode: 404,
        })

      if (!(await workhourIsEnabled(workhour.id, weekday.id)))
        return res.status(404).json({
          message: `El horario ${workhour.hours}:${workhour.minutes} no está habilitado en el día ${weekday.name}.`,
          name: "Not Found",
          statusCode: 404,
        })

      if (await isAssigned(payload.timestamp))
        return res.status(409).json({
          message: "El turno ya está asignado",
          name: "Conflic",
          statusCode: 409,
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