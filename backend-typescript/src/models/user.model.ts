import {Schema, model} from "mongoose";
import bcrypt from "bcrypt";

import { ERole } from "@enums/role.enum";
import { IUser } from "@interfaces/user.interface.";



const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: [String],
        enum: Object.values(ERole),
        default: [ERole.USER],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    refreshToken: {
        type: String,
        default: "",
    },
}, {timestamps: true})

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default model<IUser>('User', UserSchema)