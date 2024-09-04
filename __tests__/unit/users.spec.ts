import * as Service from "../../src/services/users.service"

import { Controller } from "../../src/controllers/users.controller"
import { EPrismaError } from "../../src/types/prisma.types"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Request } from "express"
import { Response } from "express"
import { User } from "@prisma/client"

jest.mock("../../src/services/users.service")

const USER_TO_CREATE: Partial<User> = {
  name: "Nombre de Test 1",
  password: "password_test",
  phone_number: "1234987654",
  email: "test@test.com",
  role: "USER",
}

describe("Create user", () => {
  const mockRequest: Partial<Request> = {
    body: USER_TO_CREATE,
  }

  const mockResponse: Partial<Response> = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  } as any as Response

  beforeEach(() => jest.clearAllMocks())

  it("should response with 201 status", async () => {
    const USER_TO_RESPONSE: Partial<User> = {
      ...USER_TO_CREATE,
      id: "cly36iasf00003b10ahkmpbts",
      password: undefined,
    }
    ;(Service.create as jest.Mock).mockResolvedValue(USER_TO_RESPONSE)

    await Controller.create(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(201)
    expect(mockResponse.json).toHaveBeenCalledWith(USER_TO_RESPONSE)
  })

  it("should response with 409 status because user already exists", async () => {
    const ERROR = new PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        clientVersion: "2.0.0",
        code: EPrismaError.UniqueConstraint,
      }
    )

    const JSON_RESPONSE = {
      message: "El usuario ya existe.",
      name: "Conflict",
      statusCode: 409,
    }

    ;(Service.create as jest.Mock).mockRejectedValue(ERROR)

    await Controller.create(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(409)
    expect(mockResponse.json).toHaveBeenCalledWith(JSON_RESPONSE)
  })

  it("should response with 500 status because some failed", async () => {
    const ERROR = new Error("Some another error but not from Prisma")

    const JSON_RESPONSE = {
      message: "Internal Server Error",
    }

    ;(Service.create as jest.Mock).mockRejectedValue(ERROR)

    await Controller.create(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith(JSON_RESPONSE)
  })
})
