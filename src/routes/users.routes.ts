import { Controller } from "../controllers/users.controller"
import { Router } from "express"

const router = Router()

router.get("/", Controller.getAll)

export default router
