import { JsonWebTokenError, sign } from "jsonwebtoken"
import { Request, Response } from "express"
import {
  create,
  getOneByEmail,
  getOneByPhoneNumber,
  setTokenById,
} from "../services/users.service"
import { decodeToken, verifyToken } from "../services/auth.service"

import { EPrismaError } from "../types/prisma.types"
import { JWT_SECRET_KEY } from "../const/jsonwebtoken"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { User } from "@prisma/client"
import { sendRecoverPasswordLink } from "../services/nodemailer.service"
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

      const user = await getOneByPhoneNumber(payload.phone_number)
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
          message: "El token es requerido.",
          name: "Unauthorized",
          statusCode: 401,
        })

      const { isPassRecover } = req.query

      const authorized = verifyToken(token)
      if (!authorized)
        return res.status(401).json({
          message: !isPassRecover
            ? "El token no es válido o ya caducó."
            : "El link no es válido o ya caducó.",
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

      const user = await getOneByEmail(email)
      if (!user)
        return res.status(404).json({
          message: "El usuario no existe.",
          name: "Not Found",
          statusCode: 404,
        })

      if (isPassRecover) {
        if (!user.token)
          return res.status(401).json({
            message: "El link no es válido o ya caducó.",
            name: "Unauthorized",
            statusCode: 401,
          })
      }

      return res.status(200).json({
        access_token: token,
        id,
        name,
        email,
        phone_number,
        role,
      })
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        return res.status(401).json({
          message: "El token no es válido o ya expiró.",
          name: "Unauthorized",
          statusCode: 401,
        })

      return res.status(500).json({
        message: "Ocurrió un error al verificar el token.",
        name: "Internal Server Error",
        statusCode: 500,
      })
    }
  },
  recover: async (req: Request, res: Response) => {
    try {
      const payload: { email: string } = req.body
      const url = req.headers.referer

      const user = await getOneByEmail(payload.email)
      if (!user)
        return res.status(404).json({
          message: "El email ingresado no está asociado a ningún usuario.",
          name: "Not Found",
          statusCode: 404,
        })

      const EXPIRATION_TOKEN = 900

      const access_token = sign(
        {
          id: user.id,
          name: user.name,
          phone_number: user.phone_number,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET_KEY as string,
        { expiresIn: EXPIRATION_TOKEN }
      )

      await setTokenById(user.id, access_token)

      return res
        .status(201)
        .json(
          await sendRecoverPasswordLink(
            url as string,
            payload.email,
            access_token
          )
        )
    } catch (error) {
      console.error(error)
      return res.status(400).json({
        message: "Ocurrió un error al enviar el email.",
        name: "Bad Request",
        statusCode: 400,
      })
    }
  },
}
