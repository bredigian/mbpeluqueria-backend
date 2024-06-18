import { Controller } from "../controllers/users.controller"
import { Router } from "express"

const router = Router()

router.get("/", Controller.getAll)
router.post("/", Controller.create)
router.delete("/", Controller.deleteById)

export default router
