import { Controller } from "../controllers/workhours-by-weekday.controller"
import { Router } from "express"

const router = Router()

router.get("/", Controller.getAll) // Básicamente obtiene los turnos HABILITADOS, NO disponibles, sino HABILITADOS
router.post("/", Controller.enableWorkhour)

export default router
