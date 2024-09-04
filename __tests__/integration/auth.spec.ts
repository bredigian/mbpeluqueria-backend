import {
  $connect,
  $disconnect,
  prisma,
} from "../../src/services/prisma.service"
import request, { type Response } from "supertest"

import App from "../../src/app"
import { User } from "@prisma/client"
import express from "express"
import TestAgent from "supertest/lib/agent"

describe("Users Integration Tests", () => {
  const USER_TO_CREATE: Partial<User> = {
    name: "Gianluca Test 1",
    email: "gianluca@test.com",
    password: "password_test",
    phone_number: "1234987654",
    role: "USER",
  }

  let app: TestAgent
  beforeAll(async () => {
    await $connect()
    const server = App(express())
    app = request(server)
  })
  afterEach(
    async () =>
      await prisma.user.deleteMany({
        where: {
          email: USER_TO_CREATE.email,
          phone_number: USER_TO_CREATE.phone_number,
        },
      })
  )
  afterAll(async () => await $disconnect())

  it("should register the user and return 201 status", async () => {
    const response: Response = await app
      .post("/auth/signup")
      .send(USER_TO_CREATE)

    expect(response.status).toBe(201)
    expect(response.body).toBeTruthy()
  })
})
