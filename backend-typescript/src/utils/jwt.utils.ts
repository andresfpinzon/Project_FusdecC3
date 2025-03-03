import { sign } from "jsonwebtoken";

import { ENV } from "@config/environments.config";
import { IUser } from "@interfaces/user.interface.";


export const generateAccessToken = (user: IUser) => {
    const token = sign({
        id: user._id,
        email: user.email,
        role: user.role
    }, ENV.JWT_SECRET, { expiresIn: '1h' });
    return token;
}


export const generateRefreshToken = (user: IUser) => {
    const token = sign({
        id: user._id,
        email: user.email,
        role: user.role
    }, ENV.JWT_SECRET, { expiresIn: '7d' });
    return token;
}