const { ERoles } = require('../enums/rolesEnum');

// Función para obtener los roles desde el enum
function obtenerRolesEnum() {
    return Object.values(ERoles);
}

module.exports = {
    obtenerRolesEnum,
};
