import { Controller } from "../controllers/workhours-by-weekday.controller"
import { Router } from "express"
import { authGuard } from "../middleware/auth.middleware"

const router = Router()

router.get("/", authGuard, Controller.getAll) // Básicamente obtiene los turnos HABILITADOS, NO disponibles, sino HABILITADOS
router.post("/", authGuard, Controller.handleWorkhour)

export default router
