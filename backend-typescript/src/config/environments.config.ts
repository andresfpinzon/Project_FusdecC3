import dotenv from "dotenv";
dotenv.config();


export const ENV = {
    PORT: Number(process.env.PORT) ,
    MONGO_URI: process.env.MONGO_URI || "" ,
    JWT_SECRET: (process.env.JWT_SECRET as string),
    JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as string),
    JWT_REFRESH_SECRET: (process.env.JWT_REFRESH_SECRET as string),
    JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN as string),
}