import { compare, hash } from "bcrypt"

export const verifyPassword = async (password: string, hash: string) =>
  await compare(password, hash)

const SALT_ROUNDS = 10

export const hashPass = async (password: string) =>
  await hash(password, SALT_ROUNDS)
