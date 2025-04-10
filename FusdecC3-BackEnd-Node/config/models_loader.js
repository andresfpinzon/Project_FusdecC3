const fs = require('fs');
const path = require('path');

const loadModels = () => {
    const modelsPath = path.join(__dirname, '..', 'models');
    
    // Leer todos los archivos en la carpeta de modelos
    fs.readdirSync(modelsPath).forEach((file) => {
        if (file.endsWith('_model.js')) {
            require(path.join(modelsPath, file));
        }
    });
};

module.exports = loadModels;
