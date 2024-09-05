import { authAdminGuard, authGuard } from "../middleware/auth.middleware"

import { Controller } from "../controllers/notices.controller"
import { Router } from "express"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.post("/", authAdminGuard, Controller.create)
router.delete("/", authAdminGuard, Controller.deleteOne)

export default router
