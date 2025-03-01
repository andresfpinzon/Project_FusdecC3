import express, { Application } from "express"
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { ENV } from "./environments.config";
import { dbConnect } from "./db.config";
import swaggerSpec from "@swagger/swagger";
import authRoutes from "@routes/auth.routes";
import userRoutes from "@routes/user.routes";

class Server {
    private app: Application;
    private port: Number
    private apiPaths = {
        auth: '/api/auth',
        user: '/api/user'
    }

    constructor(){
        this.app = express();
        this.app.use(express.json())
        this.app.use(cookieParser())

        this.port = ENV.PORT;

        // MIddlewares
        this.routes();
        this.middlewares();

    }
    
    routes(){
        console.log("*** Rutas Cargadas***")
        this.app.use(this.apiPaths.auth, authRoutes)
        this.app.use(this.apiPaths.user, userRoutes)
    }

    middlewares(){
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
        this.app.use(cors(
            {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization']
            }
        ))
        
    }

    async listen(){
        await dbConnect()
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
        console.log("Documentación swagger en: http://localhost:3000/docs")
    }
}

export default new Server