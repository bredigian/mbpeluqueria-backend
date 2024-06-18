import { Controller } from "../controllers/workhours-by-weekday.controller"
import { Router } from "express"

const router = Router()

router.post("/", Controller.enableWorkhour)

export default router
