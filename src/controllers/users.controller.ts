import { Request, Response } from "express"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { getAll } from "../services/users.service"

export const Controller = {
  getAll: async (_: Request, res: Response) => {
    try {
      return res.status(200).json({ users: await getAll() })
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
