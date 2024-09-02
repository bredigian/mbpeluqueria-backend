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
  const AUTHORIZATION =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMGxteXo5dTAwMDBqNXF3bDd0N2s5cngiLCJuYW1lIjoiTm9tYnJlIEFwZWxsaWRvIiwicGhvbmVfbnVtYmVyIjoiMTIzNDk4NzY1NCIsImVtYWlsIjoidGVzdGluZ0B0ZXN0LmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzI1MzE5OTgzLCJleHAiOjE3Mjc5MTE5ODN9.nJymSjmfZxDHkvsN4qTl7pxdyOoheQ0Xld5h0mNnwco"

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
