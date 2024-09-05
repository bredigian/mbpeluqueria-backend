import { authAdminGuard, authGuard } from "../middleware/auth.middleware"

import { Controller } from "../controllers/workhours.controller"
import { Router } from "express"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.post("/", authAdminGuard, Controller.create)

export default router
