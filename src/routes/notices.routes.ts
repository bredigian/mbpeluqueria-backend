import { Controller } from "../controllers/notices.controller"
import { Router } from "express"
import { authGuard } from "../middleware/auth.middleware"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.post("/", authGuard, Controller.create)
router.delete("/", authGuard, Controller.deleteOne)

export default router
