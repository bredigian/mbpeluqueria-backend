import { decode, verify } from "jsonwebtoken"

import { JWT_SECRET_KEY } from "../const/jsonwebtoken"

export const verifyToken = (token: string) =>
  verify(token, JWT_SECRET_KEY as string)

export const decodeToken = (token: string) => decode(token)
