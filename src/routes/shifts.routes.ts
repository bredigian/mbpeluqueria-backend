import { Controller } from "../controllers/shifts.controller"
import { Router } from "express"
import { authGuard } from "../middleware/auth.middleware"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.get("/next", authGuard, Controller.getAllNextShifts)
router.get("/user", authGuard, Controller.getAllByUserId)
router.get("/next/user", authGuard, Controller.getAllNextShiftsByUserId)
router.post("/", authGuard, Controller.create)

export default router
