import { authAdminGuard, authGuard } from "../middleware/auth.middleware"

import { Controller } from "../controllers/workhours-by-weekday.controller"
import { Router } from "express"

const router = Router()

router.get("/", authGuard, Controller.getAll) // Básicamente obtiene los turnos HABILITADOS, NO disponibles, sino HABILITADOS
router.post("/", authAdminGuard, Controller.handleWorkhour)

export default router
