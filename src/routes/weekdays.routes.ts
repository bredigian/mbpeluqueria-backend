import { Controller } from "../controllers/weekdays.controller"
import { Router } from "express"

const router = Router()

router.get("/", Controller.getAll)
router.post("/", Controller.create)

export default router
