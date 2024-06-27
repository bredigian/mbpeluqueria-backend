import { NextFunction, Request, Response } from "express"

import { verifyToken } from "../services/auth.service"

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
