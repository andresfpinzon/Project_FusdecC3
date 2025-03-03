import bcrypt from "bcrypt";

import { UpdateUserDto } from "@dtos/user.dto";
import userModel from "@models/user.model";




export const updateUserServices = async (id: string, data: UpdateUserDto) => {
    const {password} = data
    try {
        // Verificar si proporciona una nueva contraseña
        if(password){
            // Encriptar la nueva contraseña
            const salt = await bcrypt.genSalt(10)
            data.password = await bcrypt.hash(password, salt)
        }
        // 
        const updateUser = await userModel.findByIdAndUpdate(
            id, 
            data, 
            {new: true}
        ).exec()
        if(!updateUser) return {status: 404, message: "User not found"}
        
        return {
            status: 200,
            message: "User updated successfully",
            user: updateUser
        }
        
    } catch (error) {
        console.error("Error updating user in services: ", error)
        return {status: 500, message: "Error updating user in services"}
    }
}

export const getAllUsersServices = async () => {
    try {
        const users = await userModel.find().exec()
        return {
            status: 200,
            message: "Users retrieved successfully",
            users: users}
    } catch (error) {
        console.error("Error getting all users in services: ", error)
        return {status: 500, message: "Error getting all users in services"}
    }
} 


export const getUserByIdServices = async (id: string) => {
    try {
        const user = await userModel.findById(id).exec()
        if(!user) return {status: 404, message: "User not found"}
        return {
            status: 200,
            message: "User retrieved successfully",
            user: user
        }
    } catch (error) {
        console.error("Error getting user by id in services: ", error)
        return {status: 500, message: "Error getting user by id in services"}
    }
}

export const deleteUserServices = async (id: string) => {
    try {
        const user = await userModel.findByIdAndDelete(id).exec()
        if(!user) return {status: 404, message: "User not found"}
        return {
            status: 200,
            message: "User deleted successfully",
            user: user
        }
    } catch (error) {
        console.error("Error deleting user in services: ", error)
        return {status: 500, message: "Error deleting user in services"}
    }
}

export const togglerStatusUserServices = async (id: string) => {
    try {
        // Primero obtenemos el usuario actual para verificar su estado actual
        const currentUser = await userModel.findById(id).exec();
        if (!currentUser) {
            return { status: 404, message: "User not found" };
        }
        // Invertimos el estado actual (true a false o false a true)
        const newStatus = !currentUser.isActive;
        // Actualizamos el usuario con el nuevo estado
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { isActive: newStatus },
            { new: true } // Para devolver el documento actualizado
        ).exec();
        return { 
            status: 200, 
            message: `User status updated to ${newStatus ? 'active' : 'inactive'}`,
            user: updatedUser
        };
    } catch (error) {
        console.error("Error toggling status user in services: ", error)
        return {status: 500, message: "Error toggling status user in services"}
    }
}