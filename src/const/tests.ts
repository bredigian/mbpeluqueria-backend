import { config } from "dotenv"

config()

export const AUTHORIZATION_FOR_TESTS = process.env.AUTHORIZATION_FOR_TESTS
export const ADMIN_AUTHORIZATION_FOR_TESTS =
  process.env.ADMIN_AUTHORIZATION_FOR_TESTS
