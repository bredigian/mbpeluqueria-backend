import { authAdminGuard, authGuard } from "../middleware/auth.middleware"

import { Controller } from "../controllers/notifications.controller"
import { Router } from "express"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.post("/", authAdminGuard, Controller.create)
router.patch("/", authAdminGuard, Controller.update)
router.delete("/", authAdminGuard, Controller.deleteAll)

export default router
