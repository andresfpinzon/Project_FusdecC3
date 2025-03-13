import { AuthRequest } from "@middlewares/auth.middleware";
import { loginUserService, logoutUserService, registerUserService } from "@services/auth.services";
import { Request, Response } from "express";



export const registerController = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const result = await registerUserService(data)
        res.status(result.status).json(result)
    } catch (error) {
        console.error("Error registering user controller", error)
         res.status(500).json({message: "Internal server error, register controller"})
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const result = await loginUserService(data, res)
        res.status(result.status).json(result)
    } catch (error) {
        console.error("Error logging in user controller", error)
         res.status(500).json({message: "Internal server error, login controller"})
    }
}


export const logoutController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id
        const result = await logoutUserService(userId,res)
        res.status(200).json(result)
    } catch (error) {
        console.error("Error logging out user controller", error)
         res.status(500).json({message: "Internal server error, logout controller"})
    }
}
