import express, { Application } from "express"
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { ENV } from "./environments.config";
import { dbConnect } from "./db.config";
import swaggerSpec from "@swagger/swagger";
import authRoutes from "@routes/auth.routes";
import userRoutes from "@routes/user.routes";
import brigadaRouter from "@routes/brigada.routes";
import comandoRouter from "@routes/comando.routes";
import unidadRouter from "@routes/unidad.routes";

class Server {
    private app: Application;
    private port: Number
    private apiPaths = {
        auth: '/api/auth',
        user: '/api/user',
        brigada: '/api/brigada',
        comando: '/api/comando',
        unidad: '/api/unidad'
        // TODO: Agregar rutas de los otros módulos
    }

    constructor(){
        this.app = express();
        this.app.use(express.json())
        this.app.use(cookieParser())

        this.port = ENV.PORT;

        // MIddlewares
        this.middlewares();
        this.routes();


    }
    
    routes(){
        this.app.use(this.apiPaths.auth, authRoutes)
        this.app.use(this.apiPaths.user, userRoutes)
        this.app.use(this.apiPaths.brigada, brigadaRouter)
        this.app.use(this.apiPaths.comando, comandoRouter)
        this.app.use(this.apiPaths.unidad, unidadRouter)
        // TODO: Agregar rutas de los otros módulos
        console.log("*** Rutas Cargadas***")
    }

    
    middlewares(){
        try {
            // Seguridad primero
            this.app.use(helmet())
            const limiter = rateLimit({
                windowMs: 15 * 60 * 1000, // 15 minutos
                max: 100, // Limite de peticiones por IP
                message: "Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde",
            })
            this.app.use(limiter)
            // Documentación 
            this.app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
            // Cors para cookies
            this.app.use(cors({
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization'],
                credentials: true, // Importante para permitir cookies
                }))
                console.log("*** Middlewares Cargados***")
        } catch (error) {
            console.log(`Error al cargar middlewares: ${error}`)
            throw new Error(`Error al cargar middlewares: ${error}`)
        }
    }

    async listen(){
        await dbConnect()
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
        console.log("Documentación swagger en: http://localhost:3000/api/docs")
    }
}

export default new Server