import {
  $connect,
  $disconnect,
  prisma,
} from "../../src/services/prisma.service"
import request, { Test } from "supertest"

import { AUTHORIZATION_FOR_TESTS } from "../../src/const/tests"
import App from "../../src/app"
import { DateTime } from "luxon"
import { Shift } from "@prisma/client"
import TestAgent from "supertest/lib/agent"
import express from "express"

describe("Shifts Integration Tests", () => {
  const PAYLOAD: Partial<Shift> = {
    timestamp: DateTime.now().set({ hour: 15, minute: 0 }).toUTC().toJSDate(), // Martes 15:00hs
    user_id: "cm0mi29hn0000tbimnzzw8zwo", // Usuario de tests => Nombre Apellido
  }

  let app: TestAgent<Test>
  beforeAll(async () => {
    await $connect()
    const server = App(express())
    app = request(server)
  })

  afterAll(async () => {
    await prisma.shift.deleteMany({
      where: { timestamp: PAYLOAD.timestamp, user_id: PAYLOAD.user_id },
    })
    await $disconnect()
  })

  it("should create a shift and return 201", async () => {
    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${AUTHORIZATION_FOR_TESTS}` })
      .send(PAYLOAD)

    expect(response.status).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        timestamp: PAYLOAD.timestamp?.toISOString(),
      })
    )
  })

  it("should fail because shift already exists and return 409", async () => {
    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${AUTHORIZATION_FOR_TESTS}` })
      .send(PAYLOAD)

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      message: "El turno ya está asignado",
      name: "Conflic",
      statusCode: 409,
    })
  })

  it("should fail because workhour is not enabled and return 404", async () => {
    const PAYLOAD_WITH_WORKHOUR_NOT_ENABLED = {
      ...PAYLOAD,
      timestamp: DateTime.now().set({ hour: 21, minute: 0 }).toUTC(),
    }

    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${AUTHORIZATION_FOR_TESTS}` })
      .send(PAYLOAD_WITH_WORKHOUR_NOT_ENABLED)

    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: `El horario ${PAYLOAD_WITH_WORKHOUR_NOT_ENABLED.timestamp
          .setZone("America/Argentina/Buenos_Aires")
          .setLocale("es-AR")
          .hour.toString()
          .padStart(2, "0")}:${PAYLOAD_WITH_WORKHOUR_NOT_ENABLED.timestamp
          .setZone("America/Argentina/Buenos_Aires")
          .setLocale("es-AR")
          .minute.toString()
          .padStart(
            2,
            "0"
          )} no está habilitado en el día ${PAYLOAD_WITH_WORKHOUR_NOT_ENABLED.timestamp
          .setZone("America/Argentina/Buenos_Aires")
          .setLocale("es-AR")
          .weekdayLong?.charAt(0)
          .toUpperCase()
          .concat(
            `${PAYLOAD_WITH_WORKHOUR_NOT_ENABLED.timestamp
              .setZone("America/Argentina/Buenos_Aires")
              .setLocale("es-AR")
              .weekdayLong?.substring(1)}`
          )}.`,
        name: "Not Found",
        statusCode: 404,
      })
    )
  })

  it("should fail beacuse workhour is not in the system and return 404", async () => {
    const PAYLOAD_WITH_WORKHOUR_NOT_REGISTERED = {
      ...PAYLOAD,
      timestamp: DateTime.now().set({ hour: 21, minute: 15 }).toUTC(),
    }

    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${AUTHORIZATION_FOR_TESTS}` })
      .send(PAYLOAD_WITH_WORKHOUR_NOT_REGISTERED)

    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: `El horario de trabajo ${PAYLOAD_WITH_WORKHOUR_NOT_REGISTERED.timestamp
          .setZone("America/Argentina/Buenos_Aires")
          .setLocale("es-AR")
          .hour.toString()
          .padStart(2, "0")}:${PAYLOAD_WITH_WORKHOUR_NOT_REGISTERED.timestamp
          .setZone("America/Argentina/Buenos_Aires")
          .setLocale("es-AR")
          .minute.toString()
          .padStart(2, "0")} no está registrado en el sistema.`,
        name: "Not Found",
        statusCode: 404,
      })
    )
  })

  it("should fail because timestamp selected is past and return 409", async () => {
    const PAYLOAD_WITH_TIMESTAMP_FROM_PAST = {
      ...PAYLOAD,
      timestamp: DateTime.now()
        .minus({ days: 1 })
        .set({ hour: 15, minute: 30 })
        .toUTC(),
    }

    const response = await app
      .post("/shifts")
      .set({ authorization: `Bearer ${AUTHORIZATION_FOR_TESTS}` })
      .send(PAYLOAD_WITH_TIMESTAMP_FROM_PAST)

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
