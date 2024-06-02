import { Context, Hono } from "hono";
import { verifyToken } from "../middlewares/authJsonWebToken";

const router = new Hono()

router.get("/", (ctx: Context) => {
    return ctx.body("ini halaman index")
})

router.get("/dashboard", verifyToken, (ctx: Context) => {
    return ctx.body("ini halaman dashboard")
})

export const indexRoutes = router