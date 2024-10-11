const cors = require('cors');

// Configuración avanzada de CORS
const corsOptions = {
    origin: '*', //Reemplazar con el dominio que quieras permitir
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

// Middleware de CORS
const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
