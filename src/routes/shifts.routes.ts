import { Controller } from "../controllers/shifts.controller"
import { Router } from "express"

const router = Router()

router.get("/", Controller.getAll)
router.get("/next", Controller.getAllNextShifts)
router.get("/user", Controller.getAllByUserId)
router.get("/next/user", Controller.getAllNextShiftsByUserId)
router.post("/", Controller.create)

export default router
