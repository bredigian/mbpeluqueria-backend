import { Request, Response } from "express"
import { decodeToken, verifyToken } from "../services/auth.service"

import { JWT_SECRET_KEY } from "../const/jsonwebtoken"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { User } from "@prisma/client"
import { getOne } from "../services/users.service"
import { sign } from "jsonwebtoken"
import { verifyPassword } from "../lib/utils"

export const Controller = {
  signin: async (req: Request, res: Response) => {
    try {
      const payload: User = req.body

      const user = await getOne(payload.username)
      if (!user)
        return res.status(404).json({
          message: "El usuario no existe",
          name: "Not Found",
          statusCode: 404,
        })

      const match = await verifyPassword(payload.password, user.password)
      if (!match)
        return res.status(401).json({
          message: "Usuario y/o contraseña inválidos",
          name: "Unauthorized",
          statusCode: 401,
        })

      const access_token = sign(
        {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET_KEY as string,
        { expiresIn: "30d" }
      )

      return res.status(200).json({
        access_token,
        exp: 30,
        name: user.name,
        username: user.username,
      })
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
  verify: (req: Request, res: Response) => {
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

      const { name, username } = decodeToken(token) as {
        name: string
        username: string
      }

      return res.status(200).json({
        access_token: token,
        name,
        username,
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
