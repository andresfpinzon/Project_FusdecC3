const cors = require('cors');

// Configuración avanzada de CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:58014', 'http://127.0.0.1:5174'], // Dominios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

// Middleware de CORS
const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
