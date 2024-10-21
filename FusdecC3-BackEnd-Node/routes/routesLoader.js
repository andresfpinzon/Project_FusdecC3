const fs = require('fs');
const path = require('path');

// Función para pluralizar nombres
const pluralize = (word) => {
    // Verifica si la palabra termina en vocal
    const lastChar = word.charAt(word.length - 1).toLowerCase();
    if (lastChar === 'a' || lastChar === 'e' || lastChar === 'i' || lastChar === 'o' || lastChar === 'u') {
        return `${word}s`; // Agrega "s" si termina en vocal
    }
    return `${word}s`; // Para consonantes, también agrega "s"
};

// Función para cargar las rutas dinámicamente
const loadRoutes = (app) => {
    const routesPath = path.join(__dirname, 'routes'); // Carpeta de rutas

    // Leer todos los archivos en la carpeta de rutas
    fs.readdirSync(routesPath).forEach((file) => {
        // Verificar que el archivo termine con '_routes.js'
        if (file.endsWith('_routes.js')) {
            const route = `./routes/${file}`;
            // Remover el sufijo '_routes.js' y usar solo la parte anterior para el nombre de la ruta
            const routeName = path.basename(file, '_routes.js');
            const cleanRouteName = routeName.replace('_routes', ''); // Elimina '_routes'

            // Pluralizar el nombre limpio de la ruta
            const pluralRouteName = pluralize(cleanRouteName);

            // Montar la ruta en /api/{nombre pluralizado de la ruta}
            app.use(`/api/${pluralRouteName}`, require(route));
        }
    });
};

module.exports = loadRoutes;

