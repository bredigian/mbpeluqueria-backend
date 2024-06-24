import { Controller } from "../controllers/weekdays.controller"
import { Router } from "express"

const router = Router()

router.get("/", Controller.getAll)
router.get("/unavailable-workhours", Controller.getAllWithUnavailableWorkhours)
router.post("/", Controller.create)

export default router
