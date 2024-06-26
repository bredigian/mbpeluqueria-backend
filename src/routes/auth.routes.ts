import { Controller } from "../controllers/auth.controller"
import { Router } from "express"

const router = Router()

router.post("/", Controller.signin)
router.post("/signup", Controller.signup)
router.post("/verify", Controller.verify)

export default router
