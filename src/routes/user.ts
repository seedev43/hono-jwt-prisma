import { Context, Hono } from "hono";
import { login, register } from "../controllers/userController";

const router = new Hono()

router.post("/register", register)
router.post("/login", login)

export const userRoutes = router