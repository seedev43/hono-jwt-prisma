import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const verifyToken = async (ctx: Context, next: Next) => {
    let token = ctx.req.header("Authorization")

    if (token?.split(" ")[0] !== 'Bearer') {
        return ctx.json({
            success: false,
            message: "bearer token is missing"
        }, 500);
    }

    token = token.split(" ")[1]

    if (!token) {
        return ctx.json({
            success: false,
            message: "no token provided",
        }, 403)
    }

    try {
        const user = await verify(token, process.env.SECRET_KEY || "")

        // console.log(user);
        ctx.set("user", user)
        await next()

    } catch (error) {
        return ctx.json({
            success: false,
            message: "unauthorized",
        }, 401)
    }
}