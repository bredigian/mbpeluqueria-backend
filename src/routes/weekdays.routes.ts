import { authAdminGuard, authGuard } from "../middleware/auth.middleware"

import { Controller } from "../controllers/weekdays.controller"
import { Router } from "express"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.get(
  "/unavailable-workhours",
  authGuard,
  Controller.getAllWithUnavailableWorkhours
)
router.post("/", authAdminGuard, Controller.create)

export default router
