import { Request, Response } from "express"
import { create, getOne } from "../services/users.service"
import { decodeToken, verifyToken } from "../services/auth.service"

import { EPrismaError } from "../types/prisma.types"
import { JWT_SECRET_KEY } from "../const/jsonwebtoken"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { User } from "@prisma/client"
import { sign } from "jsonwebtoken"
import { verifyPassword } from "../lib/utils"

export const Controller = {
  signup: async (req: Request, res: Response) => {
    try {
      const payload: User = req.body

      const user = await create(payload)

      const access_token = sign(
        {
          id: user.id,
          name: user.name,
          phone_number: user.phone_number,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET_KEY as string,
        { expiresIn: "30d" }
      )

      return res.status(201).json({
        access_token,
        exp: 30,
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role,
      })
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
  signin: async (req: Request, res: Response) => {
    try {
      const payload: User = req.body

      const user = await getOne(payload.email, payload.phone_number)
      if (!user)
        return res.status(404).json({
          message: "El usuario no existe.",
          name: "Not Found",
          statusCode: 404,
        })

      const match = await verifyPassword(payload.password, user.password)
      if (!match)
        return res.status(401).json({
          message: "Usuario y/o contraseña inválidos.",
          name: "Unauthorized",
          statusCode: 401,
        })

      const access_token = sign(
        {
          id: user.id,
          name: user.name,
          phone_number: user.phone_number,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET_KEY as string,
        { expiresIn: "30d" }
      )

      return res.status(200).json({
        access_token,
        exp: 30,
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role,
      })
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
  verify: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.substring(7)
      if (!token)
        return res.status(401).json({
          message: "El token es requerido",
          name: "Unauthorized",
          statusCode: 401,
        })

      const authorized = verifyToken(token)
      if (!authorized)
        return res.status(401).json({
          message: "El token es requerido",
          name: "Unauthorized",
          statusCode: 401,
        })

      const { id, name, email, phone_number, role } = decodeToken(token) as {
        id: string
        name: string
        email: string
        phone_number: string
        role: string
      }

      const user = await getOne(email, phone_number)
      if (!user)
        return res.status(404).json({
          message: "El usuario no existe.",
          name: "Not Found",
          statusCode: 404,
        })

      return res.status(200).json({
        access_token: token,
        id,
        name,
        email,
        phone_number,
        role,
      })
    } catch (error) {
      return res.status(400).json({
        message: "Ocurrió un error al verificar el token",
        name: "Bad Request",
        statusCode: 400,
      })
    }
  },
}
