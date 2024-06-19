import { JWT_SECRET_KEY } from "../const/jsonwebtoken"
import { verify } from "jsonwebtoken"

export const verifyToken = (token: string) =>
  verify(token, JWT_SECRET_KEY as string)
