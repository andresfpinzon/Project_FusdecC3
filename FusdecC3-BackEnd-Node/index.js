// Importaciones básicas de Express y otras dependencias
const express = require('express');
const mongoose = require('./config/db_config');
const corsMiddleware = require('./config/cors_config'); 
const loadRoutes = require('./routes/routesLoader');

// Importar la configuración de Swagger
const { swaggerUi, swaggerDocs } = require('./config/swagger_config');

// Middleware
const app = express();

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Aplicar middleware de CORS
app.use(corsMiddleware); 

// Configuración de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Cargar todas las rutas automáticamente
loadRoutes(app);


// Puerto del servidor
const port = process.env.PORT || 3000;

// Iniciar servidor
app.listen(port, () => {
    console.log('Api REST Ok, y ejecutándose...');
    console.log(`Servidor HTTP corriendo en http://localhost:${port}/api-docs`);
});
