import { Request, Response } from "express"
import {
  create,
  deleteById,
  getAll,
  getAllByUserId,
  getAllNextShifts,
  getAllNextShiftsByUserId,
  getOfSpecificDate,
  isAssigned,
} from "../services/shifts.service"
import { decodeToken, verifyToken } from "../services/auth.service"

import { DateTime } from "luxon"
import { JwtPayload } from "jsonwebtoken"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Shift } from "@prisma/client"
import { create as createNotification } from "../services/notifications.service"
import { getOne } from "../services/weekdays.service"
import { getOne as getOneWorkhour } from "../services/workhours.service"
import { workhourIsEnabled } from "../services/workhours-by-weekdays.service"

export const Controller = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { date } = req.query
      if (!date) return res.status(200).json(await getAll())

      const specificDate = DateTime.fromISO(date as string)
      const nextDate = DateTime.fromISO(date as string).plus({ days: 1 })

      return res
        .status(200)
        .json(await getOfSpecificDate(specificDate, nextDate))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          statusCode: error.code,
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

      return res.status(200).json(await getAllByUserId(id))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          statusCode: error.code,
        })
      }
    }
  },
  getAllNextShifts: async (_: Request, res: Response) => {
    try {
      return res.status(200).json(await getAllNextShifts())
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return res.status(500).json({
          name: error.name,
          message: error.message,
          statusCode: error.code,
        })
      }
    }
  },
  getAllNextShiftsByUserId: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.substring(7)
      if (!token)
        return res.status(401).json({
          message: "El token es inválido o ya caducó.",
          name: "Unauthorized",
          statusCode: 401,
        })

      const authorized = verifyToken(token)
      if (!authorized)
        return res.status(401).json({
          message: "El token es inválido o ya caducó.",
          name: "Unauthorized",
          statusCode: 401,
        })

      const { id } = decodeToken(token) as JwtPayload

      return res.status(200).json(await getAllNextShiftsByUserId(id))
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
      const payload: Shift = req.body
      const { timestamp } = payload
      const date = DateTime.fromISO(timestamp as unknown as string)
        .setZone("America/Argentina/Buenos_Aires")
        .setLocale("es-AR")
      const today = DateTime.now()
        .setZone("America/Argentina/Buenos_Aires")
        .setLocale("es-AR")

      if (date.toMillis() < today.toMillis())
        return res.status(409).json({
          message: "No es posible reservar un turno que ya pasó.",
          name: "Conflict",
          statusCode: 409,
        })

      const weekday = await getOne(date.weekday)

      if (!weekday)
        return res.status(404).json({
          message: `El día semanal ${date.weekday} no está registrado en el sistema.`,
          name: "Not Found",
          statusCode: 404,
        })

      const workhour = await getOneWorkhour({
        hours: date.hour,
        minutes: date.minute,
      })
      if (!workhour)
        return res.status(404).json({
          message: `El horario de trabajo ${date.hour
            .toString()
            .padStart(2, "0")}:${date.minute
            .toString()
            .padStart(2, "0")} no está registrado en el sistema.`,
          name: "Not Found",
          statusCode: 404,
        })

      if (!(await workhourIsEnabled(weekday.id, workhour.id)))
        return res.status(404).json({
          message: `El horario ${workhour.hours
            .toString()
            .padStart(2, "0")}:${workhour.minutes
            .toString()
            .padStart(2, "0")} no está habilitado en el día ${weekday.name}.`,
          name: "Not Found",
          statusCode: 404,
        })

      if (await isAssigned(payload.timestamp))
        return res.status(409).json({
          message: "El turno ya está asignado",
          name: "Conflic",
          statusCode: 409,
        })

      const reserved = await create(payload)
      await createNotification({
        shift_id: reserved.id,
        shiftTimestamp: reserved.timestamp,
        userId: reserved.user.id,
        description: "¡Turno reservado!",
      })
      return res.status(201).json(reserved)
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

  deleteById: async (req: Request, res: Response) => {
    try {
      const { id } = req.query
      if (!id)
        return res.status(403).json({
          message: "El ID del turno es requerido.",
          name: "Forbidden",
          statusCode: 403,
        })

      const cancelled = await deleteById(id as string)
      await createNotification({
        shiftTimestamp: cancelled.timestamp,
        userId: cancelled.user.id,
        description: "¡Turno cancelado!",
      })
      return res.status(200).json(cancelled)
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
