import { $connect } from "../../src/services/prisma.service"
import { ADMIN_AUTHORIZATION_FOR_TESTS } from "../../src/const/tests"
import App from "../../src/app"
import TestAgent from "supertest/lib/agent"
import { WorkhoursByWeekday } from "@prisma/client"
import express from "express"
import request from "supertest"
import { workhourIsEnabled } from "../../src/services/workhours-by-weekdays.service"

describe("Workhours by weekday Integration Tests", () => {
  const WORKHOUR_TO_HANDLE: Partial<WorkhoursByWeekday> = {
    weekday_id: "clxz0hhyh0003fmlb4uay1mj1", // Miércoles
    workhour_id: "clxz0ils30007fmlbe2pxmnyk", // 10:00hs
  }

  let app: TestAgent
  beforeAll(async () => {
    await $connect()
    const server = App(express())
    app = request(server)
  })

  it("should activate workhour and return 201", async () => {
    const response = await app
      .post("/workhours-by-weekday")
      .set({ authorization: `Bearer ${ADMIN_AUTHORIZATION_FOR_TESTS}` })
      .send(WORKHOUR_TO_HANDLE)

    const isEnabled = await workhourIsEnabled(
      WORKHOUR_TO_HANDLE.weekday_id as string,
      WORKHOUR_TO_HANDLE.workhour_id as string
    )

    expect(isEnabled).toBeTruthy() // Verifica que realmente se habilitó

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining(WORKHOUR_TO_HANDLE))
  })

  it("should deactivate workhour and return 200", async () => {
    const response = await app
      .post("/workhours-by-weekday")
      .set({ authorization: `Bearer ${ADMIN_AUTHORIZATION_FOR_TESTS}` })
      .send(WORKHOUR_TO_HANDLE)

    const isEnabled = await workhourIsEnabled(
      WORKHOUR_TO_HANDLE.weekday_id as string,
      WORKHOUR_TO_HANDLE.workhour_id as string
    )

    expect(isEnabled).toBeFalsy()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({ count: 1 }))
  })

  it("should fail and return 500", async () => {
    const WORKHOUR_TO_HANDLE: Partial<WorkhoursByWeekday> = {
      weekday_id: "clxz0hhyh0003fmlb4uay", // ID Inválido
      workhour_id: "clxz0ils30007fmlbe2px", // ID Inválido
    }
    const response = await app
      .post("/workhours-by-weekday")
      .set({ authorization: `Bearer ${ADMIN_AUTHORIZATION_FOR_TESTS}` })
      .send(WORKHOUR_TO_HANDLE)

    expect(response.status).toBe(500)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: "PrismaClientKnownRequestError",
        statusCode: "P2003",
      })
    )
  })
})
