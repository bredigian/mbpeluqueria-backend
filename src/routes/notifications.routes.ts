import { Controller } from "../controllers/notifications.controller"
import { Router } from "express"
import { authGuard } from "../middleware/auth.middleware"

const router = Router()

router.get("/", authGuard, Controller.getAll)
router.post("/", authGuard, Controller.create)
router.patch("/", authGuard, Controller.update)
router.delete("/", authGuard, Controller.deleteById)

export default router
