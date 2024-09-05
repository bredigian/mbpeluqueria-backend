import { NextFunction, Request, Response } from "express"
import { decodeToken, verifyToken } from "../services/auth.service"

import { $Enums } from "@prisma/client"

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.substring(7)
  if (!token)
    return res.status(401).json({
      message: "El token de autorización es requerido.",
      name: "Unauthorized",
      statusCode: 401,
    })

  try {
    verifyToken(token)
    next()
  } catch (error) {
    return res.status(401).json({
      message: "El token es inválido o ya caducó.",
      name: "Unauthorized",
      statusCode: 401,
    })
  }
}

export const authAdminGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.substring(7)
  if (!token)
    return res.status(401).json({
      message: "El token de autorización es requerido.",
      name: "Unauthorized",
      statusCode: 401,
    })
  try {
    verifyToken(token)
    const { role } = decodeToken(token) as { role: $Enums.ERole }
    if (role === "USER")
      return res.status(403).json({
        message: "No tienes los permisos necesarios para realizar esta acción.",
        name: "Forbidden",
        statusCode: 403,
      })
    next()
  } catch (error) {
    return res.status(401).json({
      message: "El token es inválido o ya caducó.",
      name: "Unauthorized",
      statusCode: 401,
    })
  }
}
