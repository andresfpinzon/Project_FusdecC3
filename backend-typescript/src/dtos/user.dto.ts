import { ERole } from "@enums/role.enum";



export interface UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
    role?: ERole[]

}