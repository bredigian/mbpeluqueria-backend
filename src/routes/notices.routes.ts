import { Controller } from "../controllers/notices.controller"
import { Router } from "express"

const router = Router()

router.get("/", Controller.getAll)
router.post("/", Controller.create)
router.delete("/", Controller.deleteOne)

export default router
