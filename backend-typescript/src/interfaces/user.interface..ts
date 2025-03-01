import { ERole } from "@enums/role.enum";
import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  role: ERole[]
  password: string;
  isActive: boolean;
  refreshToken: string;
}