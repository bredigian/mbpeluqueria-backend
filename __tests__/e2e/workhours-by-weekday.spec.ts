import {
  $connect,
  $disconnect,
  prisma,
} from "../../src/services/prisma.service"
import { User, Workhour, WorkhoursByWeekday } from "@prisma/client"
import request, { Test } from "supertest"

import App from "../../src/app"
import TestAgent from "supertest/lib/agent"
import express from "express"

describe("Workhours by weekday E2E Tests", () => {
  const ADMIN_PAYLOAD: Partial<User> = {
    name: "Admin Test",
    email: "admintest@testing.com",
    phone_number: "admintest",
    password: "adminpassword",
    role: "ADMIN",
  }

  const WORKHOUR_PAYLOAD: Partial<Workhour> = {
    hours: 7,
    minutes: 30,
  }

  let ADMIN_ID = ""
  let TOKEN = ""
  let WORKHOUR_ID = ""
  const WEEKDAY_ID = "clxz0h8fa0001fmlb0p7d46f0" // Lunes

  let PAYLOAD: Partial<WorkhoursByWeekday> = {}

  let app: TestAgent<Test>
  beforeAll(async () => {
    await $connect()
    const server = App(express())
    app = request(server)

    const { status, body } = await app.post("/auth/signup").send(ADMIN_PAYLOAD)

    expect(status).toBe(201)
    expect(body.access_token).toBeTruthy()

    ADMIN_ID = body.id
    TOKEN = body.access_token

    const workhourResponse = await app
      .post("/workhours")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(WORKHOUR_PAYLOAD)

    expect(workhourResponse.status).toBe(201)
    expect(workhourResponse.body.id).toBeTruthy()

    WORKHOUR_ID = workhourResponse.body.id

    PAYLOAD = { weekday_id: WEEKDAY_ID, workhour_id: WORKHOUR_ID }
  })

  afterAll(async () => {
    await prisma.workhoursByWeekday.deleteMany({
      where: { weekday_id: WEEKDAY_ID, workhour_id: WORKHOUR_ID },
    })
    await prisma.workhour.delete({ where: { id: WORKHOUR_ID } })
    await prisma.user.delete({ where: { id: ADMIN_ID } })
    await $disconnect()
  })

  it("should activate workhour by weekday and return 201", async () => {
    const { status, body } = await app
      .post("/workhours-by-weekday")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(PAYLOAD)

    expect(status).toBe(201)
    expect(body.id).toBeTruthy()
  })

  it("should deactivate workhour by weekday and return 200", async () => {
    const { status, body } = await app
      .post("/workhours-by-weekday")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(PAYLOAD)

    expect(status).toBe(200)
    expect(body).toEqual(
      expect.objectContaining({
        count: 1,
      })
    )
  })

  it("should reject the request and return 500 status", async () => {
    const INVALID_PAYLOAD: Partial<WorkhoursByWeekday> = {
      weekday_id: "aslkdjasdlas", // ID Inválido
      workhour_id: "lkasjdaskjdsad", // ID Inválido
    }

    const { status, body } = await app
      .post("/workhours-by-weekday")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(INVALID_PAYLOAD)

    expect(status).toBe(500)
    expect(body).toEqual(
      expect.objectContaining({
        name: "PrismaClientKnownRequestError",
        statusCode: "P2003",
      })
    )
  })
})
