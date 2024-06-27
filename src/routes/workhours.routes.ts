import { Controller } from "../controllers/workhours.controller"
import { Router } from "express"
import { authGuard } from "../middleware/auth.middleware"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.post("/", authGuard, Controller.create)

export default router
