const fs = require('fs');
const path = require('path');

// Función para cargar las rutas dinámicamente
const loadRoutes = (app) => {
    const routesPath = path.join(__dirname, 'routes'); // Carpeta de rutas
    fs.readdirSync(routesPath).forEach((file) => {
        const route = `./routes/${file}`;
        // Remover el sufijo '_routes.js' y usar solo la parte anterior para el nombre de la ruta
        const routeName = path.basename(file, '_routes.js');
        const cleanRouteName = routeName.replace('_routes', ''); // Elimina '_routes'
        app.use(`/api/${cleanRouteName}`, require(route)); // Montar la ruta en /api/{nombre limpio de la ruta}
    });
};

module.exports = loadRoutes;

