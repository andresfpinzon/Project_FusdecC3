import { Request, Response } from "express";
import { deleteUserServices, getAllUsersServices, getUserByIdServices, togglerStatusUserServices, updateUserServices } from "@services/user.services";


export const updateUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const data = req.body
        const result = await updateUserServices(userId, data)
        res.status(result.status).json(result)
    } catch (error) {
        console.error("Error updating user controller", error)
        res.status(500).json({message: "Internal server error, update user controller"})
    }
}
export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const result = await getUserByIdServices(userId)
        res.status(result.status).json(result)
    } catch (error) {
        console.error("Error getting user by id controller", error)
        res.status(500).json({message: "Internal server error, getting user by id controller"})
    }
}

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const result = await getAllUsersServices()
        res.status(result.status).json(result)
    } catch (error) {
        console.error("Error getting all users controller", error)
        res.status(500).json({message: "Internal server error, getting all users controller"})
    }
}

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const result = await deleteUserServices(userId)
        res.status(result.status).json(result)
    } catch (error) {
        console.error("Error deleting user controller", error)
    }
}

export const toggleStatusUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const result = await togglerStatusUserServices(userId)
        res.status(result.status).json(result)
    } catch (error) {
        console.error("Error toggling status user controller", error)
    }
}