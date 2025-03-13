const { ERoles } = require('../enums/rolesEnum');

// Función para obtener los roles desde el enum
function obtenerRolesEnum() {
    try {
    return Object.values(ERoles);
    } catch (error) {
        console.error('Error al obtener los roles (rol_logic):', error);
        throw error;
    }
}

module.exports = {
    obtenerRolesEnum,
};
