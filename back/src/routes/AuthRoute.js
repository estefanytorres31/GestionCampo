import {
    login
} from "../controllers/AuthController.js"
import { Router } from "express"

const authRouter = Router()

authRouter.post("/api/auth/login", login)

export default authRouter