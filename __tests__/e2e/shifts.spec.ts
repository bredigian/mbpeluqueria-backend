import request, { type Test } from "supertest"

import {
  $connect,
  $disconnect,
  prisma,
} from "../../src/services/prisma.service"
import App from "../../src/app"
import TestAgent from "supertest/lib/agent"
import { Shift, User } from "@prisma/client"
import express from "express"
import { DateTime } from "luxon"

describe("Shifts E2E Tests", () => {
  const USER_PAYLOAD: Partial<User> = {
    name: "E2EUser Testing",
    email: "e2euser@testing.com",
    phone_number: "9999876543",
    password: "e2epassword",
    role: "USER",
  }

  const TIMESTAMP_TO_SHIFT = DateTime.now()
    .plus({ days: 1 }) // Mañana
    .set({ hour: 21, minute: 0 }) // 21:00hs
    .toUTC()

  let TOKEN = ""
  let USER_ID = ""

  let app: TestAgent<Test>
  beforeAll(async () => {
    await $connect()

    const server = App(express())
    app = request(server)

    // Sign up del cliente
    const { status, body } = await app.post("/auth/signup").send(USER_PAYLOAD)

    expect(status).toBe(201)
    expect(body.access_token).toBeTruthy()

    TOKEN = body.access_token
    USER_ID = body.id
  })

  afterAll(async () => {
    await prisma.shift.deleteMany({
      where: { timestamp: TIMESTAMP_TO_SHIFT.toISO() },
    })
    await prisma.user.delete({ where: { id: USER_ID } })
    await $disconnect()
  })

  it("should create a shift and response with 201 status", async () => {
    const SHIFT_PAYLOAD: Partial<Shift> = {
      user_id: USER_ID,
      timestamp: TIMESTAMP_TO_SHIFT.toJSDate(),
    }

    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(SHIFT_PAYLOAD)

    expect(response.status).toBe(201)
    expect(response.body.id).toBeTruthy()
  })

  it("should reject the shift request because it's already scheduled and response with 409 status", async () => {
    const SHIFT_PAYLOAD: Partial<Shift> = {
      user_id: USER_ID,
      timestamp: TIMESTAMP_TO_SHIFT.toJSDate(),
    }

    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(SHIFT_PAYLOAD)

    expect(response.status).toBe(409)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "El turno ya está asignado",
        name: "Conflic",
        statusCode: 409,
      })
    )
  })

  it("should reject the shift request because workhour of timestamp is not enable for that weekday and return 404 status", async () => {
    const TIMESTAMP_TO_SHIFT = DateTime.now()
      .plus({ days: 1 }) // Mañana
      .set({ hour: 15, minute: 0 }) // 15:00hs
      .toUTC()
    const SHIFT_PAYLOAD: Partial<Shift> = {
      user_id: USER_ID,
      timestamp: TIMESTAMP_TO_SHIFT.toJSDate(),
    }

    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(SHIFT_PAYLOAD)

    const TIMESTAMP_FOR_RESPONSE = DateTime.fromJSDate(
      SHIFT_PAYLOAD.timestamp as Date
    )

    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: `El horario ${TIMESTAMP_FOR_RESPONSE.setZone(
          "America/Argentina/Buenos_Aires"
        )
          .setLocale("es-AR")
          .hour.toString()
          .padStart(2, "0")}:${TIMESTAMP_FOR_RESPONSE.setZone(
          "America/Argentina/Buenos_Aires"
        )
          .setLocale("es-AR")
          .minute.toString()
          .padStart(
            2,
            "0"
          )} no está habilitado en el día ${TIMESTAMP_FOR_RESPONSE.setZone(
          "America/Argentina/Buenos_Aires"
        )
          .setLocale("es-AR")
          .weekdayLong?.charAt(0)
          .toUpperCase()
          .concat(
            `${TIMESTAMP_FOR_RESPONSE.setZone("America/Argentina/Buenos_Aires")
              .setLocale("es-AR")
              .weekdayLong?.substring(1)}`
          )}.`,
        name: "Not Found",
        statusCode: 404,
      })
    )
  })

  it("should reject the shift request because workhour of timestamp is not registered on the system and return 404 status", async () => {
    const TIMESTAMP_TO_SHIFT = DateTime.now()
      .plus({ days: 1 }) // Mañana
      .set({ hour: 23, minute: 0 }) // 23:00hs
      .toUTC()
    const SHIFT_PAYLOAD: Partial<Shift> = {
      user_id: USER_ID,
      timestamp: TIMESTAMP_TO_SHIFT.toJSDate(),
    }

    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(SHIFT_PAYLOAD)

    const TIMESTAMP_FOR_RESPONSE = DateTime.fromJSDate(
      SHIFT_PAYLOAD.timestamp as Date
    )

    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: `El horario de trabajo ${TIMESTAMP_FOR_RESPONSE.setZone(
          "America/Argentina/Buenos_Aires"
        )
          .setLocale("es-AR")
          .hour.toString()
          .padStart(2, "0")}:${TIMESTAMP_FOR_RESPONSE.setZone(
          "America/Argentina/Buenos_Aires"
        )
          .setLocale("es-AR")
          .minute.toString()
          .padStart(2, "0")} no está registrado en el sistema.`,
        name: "Not Found",
        statusCode: 404,
      })
    )
  })

  it("should reject the shift request because timestamp has passed and return 409 status", async () => {
    const TIMESTAMP_TO_SHIFT = DateTime.now()
      .minus({ days: 1 }) // Ayer
      .set({ hour: 21, minute: 0 }) // 21:00hs
      .toUTC()
    const SHIFT_PAYLOAD: Partial<Shift> = {
      user_id: USER_ID,
      timestamp: TIMESTAMP_TO_SHIFT.toJSDate(),
    }

    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${TOKEN}` })
      .send(SHIFT_PAYLOAD)

    expect(response.status).toBe(409)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "No es posible reservar un turno que ya pasó.",
        name: "Conflict",
        statusCode: 409,
      })
    )
  })
})
