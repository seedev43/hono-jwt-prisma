import { Context } from "hono";
import prisma from "../config/prisma";
import { compare, hash } from "bcrypt";
import { sign } from 'hono/jwt'
import { getRandomNumber } from "../utils/functions";

export const register = async (ctx: Context) => {
    let body = await ctx.req.json()

    const { name, email, username, password } = body

    if (!username || !email || !password) {
        return ctx.json({
            success: false,
            message: "username, email, and password are required"
        }, 400)
    }

    try {

        // Check for existing email

        const emailUser = await prisma.user.findUnique({
            where: { email }
        });

        if (emailUser) {
            return ctx.json({
                success: false,
                message: "email is already in use"
            }, 400);
        }

        // Check for existing username
        const usernameUser = await prisma.user.findUnique({
            where: { username }
        });

        if (usernameUser) {
            return ctx.json({
                success: false,
                message: "username is already in use"
            }, 400);
        }

        // creating new user
        const user = await prisma.user.create({
            data: {
                name: name ?? `User #${getRandomNumber(1, 99)}`,
                email: email,
                username: username,
                password: await hash(password, 12)
            }
        })

        return ctx.json({
            success: true,
            message: "User Registered Successfully",
            data: user
        }, 201)

    } catch (error) {
        return ctx.json({
            success: false,
            message: "Internal Server Error"
        }, 500)
    }
}

export const login = async (ctx: Context) => {
    let body = await ctx.req.json()

    const { username, password } = body

    if (!username || !password) {
        return ctx.json({
            success: false,
            message: "username, and password are required"
        }, 400)
    }

    try {


        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (!user) {
            return ctx.json({
                success: false,
                message: "user not found"
            }, 404)
        }
        const passwordIsValid = await compare(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return ctx.json({
                success: false,
                message: "invalid password",
            }, 401)
        }

        const generateToken = await sign({
            id: user.id,
            name: user.name,
            username: user.username
        }, process.env.SECRET_KEY || "")

        return ctx.json({
            success: true,
            message: "login success",
            accessToken: generateToken
        }, 200)

    } catch (error) {
        return ctx.json({
            success: false,
            message: "Internal Server Error"
        }, 500)
    }
}