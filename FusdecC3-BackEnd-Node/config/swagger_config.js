const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Metadata acerca de nuestra API
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Gestión de Registro de Asistencia y Generación de Certificados",
      version: "1.0.0",
      description: "Documentación de las APIs para el manejo de las diferentes entidades relevantes de la fundación FusdecC3",
      contact: {
        name: "Andres Pinzon, Santiago Gonzales, Adriana Lucia, Sebastian Pinzon",
        email: "andrespinzonxd@gmail.com, sebastian.pinzon.3954@gmail.com, adrilucia603@gmail.com, santiagorys2003@gmail.com", 
      },
      license: {
        name: "MIT", 
        url: "https://opensource.org/licenses/MIT", 
      },
    },
    servers: [
      {
        url: "http://localhost:3000", // Base URL 
        description: "Servidor de desarrollo", 
      },
    ],
  },
  apis: ["./routes/*.js"], // Path hacia las APIs
};

// Documentación en formato JSON
const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = { swaggerUi, swaggerDocs };