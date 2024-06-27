import { Request, Response } from "express"
import {
  create,
  deleteById,
  getAll,
  getOneByEmail,
  update,
} from "../services/users.service"
import { decodeToken, verifyToken } from "../services/auth.service"

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
  update: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.substring(7)
      if (!token)
        return res.status(401).json({
          message: "El token es requerido.",
          name: "Unauthorized",
          statusCode: 401,
        })

      const authorized = verifyToken(token)
      if (!authorized)
        return res.status(401).json({
          message: "El token no es válido.",
          name: "Unauthorized",
          statusCode: 401,
        })

      const { email } = decodeToken(token) as {
        id: string
        name: string
        email: string
        phone_number: string
        role: string
      }

      const user = await getOneByEmail(email)
      if (!user)
        return res.status(404).json({
          message: "El usuario no existe.",
          name: "Not Found",
          statusCode: 404,
        })

      const payload: { password: string } = req.body
      return res.status(200).json(await update(user.id, payload.password))
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
