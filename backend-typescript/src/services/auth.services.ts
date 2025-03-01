import { Response } from "express";


import { LoginDto, RegisterDto } from "@dtos/auth.dto";
import userModel from "@models/user.model";
import { generateAccessToken, generateRefreshToken } from "@utils/jwt.utils";
import { comparePassword } from "@utils/password.utils";



export const registerUserService = async (data: RegisterDto) => {
    // Extraigo de la data el email
    const { email } = data
    try {
        // Busco el usuario por email
        const userExist = await userModel.findOne({email}).exec()
        // Si existe, devuelvo un error
        if(userExist) return { status: 400, message: "User already exists" }
        // Si no existe, lo creo
        const user = await new userModel(data).save()
        // Devuelvo el usuario creadol, con un estado y un mensaje
        return { status: 201, message: "User created", data: user }
    } catch (error) {
        console.error(`Error in registerUser: ${error}`)
        return { status: 500, message: "Internal server error, register service" }
    }
}


export const loginUserService = async (data: LoginDto, res: Response ) => {
    // Extraigo de la data el email y el password
    const {email, password} = data
    try {
        // Busco el usuario por email
        const user = await userModel.findOne({email}).exec()
        // Si no existe, devuelvo un error
        if(!user) return { status: 400, message: "User does not exist" }
        // Si existe, comparo el password
        const isPasswordValid = await comparePassword(password, user.password)
        // Si no es valido, devuelvo un error
        if(!isPasswordValid) return { status: 400, message: "Invalid password" }
        // Si es valido, genero el token y el refresh token
        const accestoken = generateAccessToken(user)
        const refresh = generateRefreshToken(user)
        // Guardo el refresh token en la base de datos
        user.refreshToken = refresh
        await user.save()
        // Devuelvo el token y lo guardo en una cookie
        res.cookie("token", accestoken, {
            httpOnly: true
        })
        res.cookie("refreshToken", refresh, {
            httpOnly: true
        })
        // Devuelvo el token, el estado y un mensaje
        return { status: 200, message: "User logged in", token: accestoken }

    }catch (error) {
        console.error(`Error in loginUser: ${error}`)
        return { status: 500, message: "Internal server error, login service" }
    }
}


export const logoutUserService = async (userId: string, res: Response) => {
    try {
        // Busco el usuario por id, actualizo el refresh token a "" y guardo los cambios
        const userExist = await userModel.findByIdAndUpdate(userId, {refreshToken: ""}, {new: true}).exec()
        // Si no existe, devuelvo un error
        if(!userExist) return { status: 400, message: "User does not exist" }
        // Si existe, borro las cookias
        res.clearCookie("token")
        res.clearCookie("refreshToken")
        // Devuelvo el estado y un mensaje
        return { status: 200, message: "User logged out" }
    } catch (error) {
        console.error(`Error in logoutUser: ${error}`)
        return { status: 500, message: "Internal server error, logout service" }
    }
}

