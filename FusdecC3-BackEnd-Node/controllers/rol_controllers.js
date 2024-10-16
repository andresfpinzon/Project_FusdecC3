const logic = require('../logic/rol_logic');
const rolSchemaValidation = require('../validations/rol_validations'); // Importa la validación

// Controlador para listar todos los roles
const listarRoles = async (req, res) => {
  try {
    const roles = await logic.listarRoles();
    if (roles.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para crear un rol
const crearRol = async (req, res) => {
  const body = req.body;
  const { error, value } = rolSchemaValidation.validate({
    rolName: body.rolName,
    estadoRol: body.estadoRol
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevoRol = await logic.crearRol(value);
    res.status(201).json(nuevoRol);
  } catch (err) {
    if (err.message === 'El nombre del rol ya existe') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para actualizar un rol
const actualizarRol = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { error, value } = rolSchemaValidation.validate({
    rolName: body.rolName,
    estadoRol: body.estadoRol
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const rolActualizado = await logic.actualizarRol(id, value);
    if (!rolActualizado) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rolActualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para desactivar un rol
const desactivarRol = async (req, res) => {
  const { id } = req.params;
  try {
    const rolDesactivado = await logic.desactivarRol(id);
    if (!rolDesactivado) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rolDesactivado);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener un rol por su ID
const obtenerRolPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await logic.obtenerRolPorId(id);
    if (!rol) {
      return res.status(404).json({ error: `Rol con ID ${id} no encontrado` });
    }
    res.json(rol);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  listarRoles,
  crearRol,
  actualizarRol,
  desactivarRol,
  obtenerRolPorId,
};
