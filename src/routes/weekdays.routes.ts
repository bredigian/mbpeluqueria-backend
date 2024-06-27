import { Controller } from "../controllers/weekdays.controller"
import { Router } from "express"
import { authGuard } from "../middleware/auth.middleware"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.get(
  "/unavailable-workhours",
  authGuard,
  Controller.getAllWithUnavailableWorkhours
)
router.post("/", authGuard, Controller.create)

export default router
