import { Controller } from "../controllers/shifts.controller"
import { Router } from "express"

const router = Router()

router.get("/", Controller.getAll)
router.get("/user", Controller.getAllByUserId)
router.post("/", Controller.create)

export default router
