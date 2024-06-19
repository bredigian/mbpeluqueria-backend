import { compare } from "bcrypt"

export const verifyPassword = async (password: string, hash: string) =>
  await compare(password, hash)
