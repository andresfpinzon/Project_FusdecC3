const logic = require('../logic/rol_logic');

// Controlador para obtener los roles del enum
const obtenerRolesEnum = (req, res) => {
  try {
    const rolesEnum = logic.obtenerRolesEnum();
    res.json(rolesEnum);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerRolesEnum,
};
